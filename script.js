// Background me bina video play kiye direct video save karne ka function
async function startDirectDownload(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");
        
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
        // Agar fetch block ho, toh usi window me safe download trigger ho jaye
        window.location.href = url;
    }
}

async function fetchVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid TikTok link!');
        return;
    }

    if (!videoUrl.includes('tiktok.com')) {
        alert('This downloader is only for TikTok videos! Please paste a valid TikTok link.');
        return;
    }

    const btn = document.getElementById('fetchBtn') || document.querySelector('button');
    const loader = document.getElementById('loader');

    if (btn) btn.innerText = "Downloading...";
    if (loader) loader.style.display = 'block';

    try {
        // Direct TikTok working backend call
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl })
        });
        
        const data = await res.json();
        
        if (data && data.downloadUrl) {
            // Video bina play hue direct file download hogi
            await startDirectDownload(data.downloadUrl, 'tiktok_video.mp4');
        } else if (data && data.error) {
            alert(data.error);
        } else {
            alert('Could not download this TikTok video. Please try another link!');
        }
    } catch (err) {
        console.error(err);
        alert('Server connection error. Please try again!');
    }

    if (btn) btn.innerText = "Fetch Video";
    if (loader) loader.style.display = 'none';
}

// Button setup
const mainBtn = document.getElementById('fetchBtn') || document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}