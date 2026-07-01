async function fetchVideo() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    if (!videoUrl) {
        alert('Please paste a valid video link!');
        return;
    }

    const btn = document.querySelector('button');
    if (btn) btn.innerText = "Fetching...";

    try {
        // Saari requests humare Vercel backend par jayengi
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl })
            
        });
        
        const data = await res.json();
        
        if (data && data.downloadUrl) {
            window.open(data.downloadUrl, '_blank');
        } else {
            alert(data.error || 'Server is temporarily busy. Please try another link!');
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        alert('Connection error. Please try again!');
    }

    if (btn) btn.innerText = "Fetch Video";
}

// Button Connection
const mainBtn = document.querySelector('button');
if (mainBtn) {
    mainBtn.removeEventListener('click', fetchVideo); // Purane events clear karne ke liye
    mainBtn.addEventListener('click', fetchVideo);
}