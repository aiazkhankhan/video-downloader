document.getElementById('fetchBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid video link!');
        return;
    }

    // Loader/Spinner show karein
    document.getElementById('loader').style.display = 'block';

    // 1. Agar TikTok ho toh hamare Vercel backend par bhejien (Kyunki backend par TikTok 100% chal raha hai)
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
                document.getElementById('loader').style.display = 'none';
                return;
            }
        } catch (err) {
            console.log("Backend TikTok failed, falling back to direct fetch");
        }
    }

    // 2. INSTAGRAM, FACEBOOK, YOUTUBE KE LIYE (Direct Browser Bypass - No Vercel Server)
    try {
        // Cobalt API ka direct server call bina Vercel proxy ke
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
            // Video download link mil gaya, new tab mein open karein
            window.open(data.url, '_blank');
        } else if (data && data.text) {
            alert(`Error: ${data.text}`);
        } else {
            alert('Could not process this link. Please try another video!');
        }
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        alert('Server is temporarily busy. Please check your network or try another link!');
    }

    // Loader/Spinner hide karein
    document.getElementById('loader').style.display = 'none';
});