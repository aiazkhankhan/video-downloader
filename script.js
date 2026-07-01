async function fetchVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid video link!');
        return;
    }

    const btn = document.querySelector('button');
    if (btn) btn.innerText = "Fetching...";

    // 1. TIKTOK KE LIYE (Backend par bhejien - Working 100%)
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
            console.log("Backend TikTok failed, trying direct fetch...");
        }
    }

    // 2. INSTAGRAM & FACEBOOK KE LIYE (Sandip Baruwal Premium Direct API)
    try {
        // Yeh API direct video link extract karti hai bina kisi block ke
        const response = await fetch(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        
        if (data && data.url) {
            window.open(data.url, '_blank');
            if (btn) btn.innerText = "Fetch Video";
            return;
        }
    } catch (error) {
        console.log("Primary Instagram API failed, trying cobalt fallback...");
    }

    // 3. FALLBACK (Cobalt Engine)
    try {
        const response = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: videoUrl,
                filenamePattern: 'basic'
            })
        });

        const data = await response.json();
        if (data && data.url) {
            window.open(data.url, '_blank');
        } else {
            alert('Instagram server is strict today. Please try another video link!');
        }
    } catch (error) {
        alert('Server is temporarily busy. Please try another link!');
    }

    if (btn) btn.innerText = "Fetch Video";
}

// Button connection
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}