// Video file ko background me fetch kar ke direct download (save) karwane ka function
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
        // Agar high-security video ho aur blob block ho, toh safe option direct window stream hai
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

    // 1. TIKTOK KE LIYE (Aapka backend perfect chal raha hai)
    if (videoUrl.includes('tiktok.com')) {
        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl })
            });
            const data = await res.json();
            if (data.downloadUrl) {
                await startDirectDownload(data.downloadUrl, 'tiktok_video.mp4');
                if (btn) btn.innerText = "Fetch Video";
                return;
            }
        } catch (err) {
            console.log("TikTok Backend Failed");
        }
    }

    // 2. INSTAGRAM & FACEBOOK KE LIYE (Direct Frontend Dedicated Extraction Engine)
    try {
        // Yeh direct high-success browser network request hai jo bina server ke kam karti hai
        const response = await fetch(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        
        if (data && data.url) {
            let filename = videoUrl.includes('instagram.com') ? 'instagram_video.mp4' : 'facebook_video.mp4';
            await startDirectDownload(data.url, filename);
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (error) {
        console.log("Primary Engine failed, trying specialized proxy...");
    }

    // 3. BACKUP DIRECT ENGINE FOR INSTAGRAM
    try {
        const response = await fetch(`https://api.vkrdown.com/insta?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        
        if (data && data.data && data.data.video) {
            await startDirectDownload(data.data.video, 'instagram_video.mp4');
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (e) {
        console.log("Backup Engine failed");
    }

    alert('The video link couldn\'t be parsed right now. Please verify the URL or try another link.');
    if (btn) btn.innerText = "Fetch Video";
}

// Button click setup
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}