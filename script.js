async function fetchVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid video link!');
        return;
    }

    const btn = document.querySelector('button');
    if (btn) btn.innerText = "Fetching...";

    // 1. TIKTOK KE LIYE (Backend 100% Working)
    if (videoUrl.includes('tiktok.com')) {
        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl })
            });
            const data = await res.json();
            if (data.downloadUrl) {
                window.open(data.downloadUrl, '_blank');
                if (btn) btn.innerText = "Fetch Video";
                return;
            }
        } catch (err) {
            console.log("Backend TikTok failed.");
        }
    }

    // 2. INSTAGRAM & FACEBOOK (High-Speed Universal Fetcher)
    try {
        // Yeh dedicated open api direct standard extraction karti hai
        const response = await fetch(`https://api.vkrdown.com/insta?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        
        if (data && data.data && data.data.video) {
            window.open(data.data.video, '_blank');
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (error) {
        console.log("Primary fetch failed, trying rapid engine...");
    }

    // 3. BACKUP (Rapid Snap Engine)
    try {
        const response = await fetch(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        if (data && data.url) {
            window.open(data.url, '_blank');
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (e) {
        console.log("Backup failed.");
    }

    alert('Server is temporarily busy. Please try another video link!');
    if (btn) btn.innerText = "Fetch Video";
}

// Button click setup
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}