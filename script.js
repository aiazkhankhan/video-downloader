// Background me bina video play kiye direct video save karne ka function
async function triggerDirectDownload(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response error");
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    } catch (error) {
        // Agar high encryption video block ho rahi ho browser fetch se, toh location stream se window par direct download hogi
        window.location.href = url;
    }
}

async function fetchVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid video link!');
        return;
    }

    const btn = document.querySelector('button');
    if (btn) btn.innerText = "Downloading...";

    try {
        // Tamam requests secure server backend ke raste jayengi
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl })
        });
        
        const data = await res.json();
        
        if (data && data.downloadUrl) {
            let filename = 'video_download.mp4';
            if (videoUrl.includes('tiktok.com')) filename = 'tiktok_video.mp4';
            if (videoUrl.includes('instagram.com')) filename = 'instagram_video.mp4';
            if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) filename = 'facebook_video.mp4';

            // Background download active karein
            await triggerDirectDownload(data.downloadUrl, filename);
        } else if (data && data.error) {
            alert(data.error);
        } else {
            alert('Could not download this specific video. Try another link!');
        }
    } catch (err) {
        console.error(err);
        alert('Server is currently under high load. Please try again in a few moments!');
    }

    if (btn) btn.innerText = "Fetch Video";
}

// Button selection check
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}