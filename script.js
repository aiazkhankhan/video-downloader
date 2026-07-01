// Video ko direct file ki tarah download karwane ka function
async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = filename || 'video.mp4';
        
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    } catch (error) {
        // Agar browser background fetch block kare (CORS issue), toh safe side new tab me open karwa do
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

    // 1. TIKTOK KE LIYE
    if (videoUrl.includes('tiktok.com')) {
        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl })
            });
            const data = await res.json();
            if (data.downloadUrl) {
                // Play karne ke bajaye direct file download hogi
                await downloadFile(data.downloadUrl, 'tiktok_video.mp4');
                if (btn) btn.innerText = "Fetch Video";
                return;
            }
        } catch (err) {
            console.log("TikTok backend failed.");
        }
    }

    // 2. INSTAGRAM & FACEBOOK KE LIYE (Bypass with Worker API)
    try {
        const response = await fetch(`https://api.vkrdown.com/insta?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        
        if (data && data.data && data.data.video) {
            await downloadFile(data.data.video, 'instagram_video.mp4');
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (error) {
        console.log("Primary Insta fetch failed.");
    }

    // 3. BACKUP INSTAGRAM API
    try {
        const response = await fetch(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        if (data && data.url) {
            await downloadFile(data.url, 'instagram_video.mp4');
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (e) {
        console.log("Backup failed.");
    }

    alert('Both download servers are busy. Please try another video link!');
    if (btn) btn.innerText = "Fetch Video";
}

// Button setup
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}