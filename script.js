// Video ko background me fetch kar ke direct download karwane ka function
async function forceDownload(url, filename) {
    try {
        const response = await fetch(url);
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
        // Agar browser background stream block kare, toh new tab me open karega safe side ke liye
        window.open(url, '_blank');
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
        // Saari requests direct backend server par bhejein
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

            // Direct download function trigger karein
            await forceDownload(data.downloadUrl, filename);
        } else if (data && data.error) {
            alert(data.error);
        } else {
            alert('Could not parse this link. Please try another video!');
        }
    } catch (err) {
        console.error(err);
        alert('Server connection error. Please try again!');
    }

    if (btn) btn.innerText = "Fetch Video";
}

// Button setup
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}