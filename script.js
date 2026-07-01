async function fetchVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid video link!');
        return;
    }

    // Loader handle karne ke liye (Aapki CSS classes ke mutabiq)
    const btn = document.querySelector('button');
    if (btn) btn.innerText = "Fetching...";

    // 1. TIKTOK KE LIYE (Backend par bhejien kyunki woh chal raha hai)
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

    // 2. INSTAGRAM & FACEBOOK KE LIYE (Direct Browser Bypass)
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
        } else if (data && data.text) {
            alert(`Error: ${data.text}`);
        } else {
            alert('Could not process this link. Please try another video!');
        }
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        alert('Server is temporarily busy. Please try another link!');
    }

    if (btn) btn.innerText = "Fetch Video";
}

// HTML wale button ke function click ko connect karne ke liye
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.addEventListener('click', fetchVideo);
}