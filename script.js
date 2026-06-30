document.getElementById('downloadBtn').addEventListener('click', async () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('resultArea');

    if (!videoUrl) {
        alert('Please paste a valid video URL first!');
        return;
    }

    loader.style.display = 'block';
    resultArea.style.display = 'none';

    try {
        const response = await fetch('https://video-downloader-two-eta.vercel.app/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl: videoUrl })
        });

        const data = await response.json();

        if (data.downloadUrl) {
            loader.style.display = 'none';
            resultArea.style.display = 'block';

            const finalDownloadLink = document.getElementById('finalDownloadLink');
            
            // --- Direct Download (Blob Method) ---
            finalDownloadLink.onclick = async (e) => {
                e.preventDefault(); // Browser ko play karne se rokna
                
                const originalText = document.querySelector('.success-btn').innerHTML;
                // Yahan humne "Saving to PC..." ko badal kar sirf "Saving..." kar diya hai
                document.querySelector('.success-btn').innerHTML = `<i class="fas fa-spinner fa-spin"></i> Saving...`;

                try {
                    const videoResponse = await fetch(data.downloadUrl);
                    const blob = await videoResponse.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    
                    const tempLink = document.createElement('a');
                    tempLink.href = blobUrl;
                    tempLink.download = 'video-downloader.mp4'; // Video file name
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    
                    document.querySelector('.success-btn').innerHTML = originalText;
                } catch (err) {
                    // Fallback: Agar blob fail ho toh naye tab me khol do
                    window.open(data.downloadUrl, '_blank');
                    document.querySelector('.success-btn').innerHTML = originalText;
                }
            };

            const successBtn = document.querySelector('.success-btn');
            successBtn.innerHTML = `<i class="fas fa-download"></i> Download Video Now`;
            
        } else {
            alert('Error: ' + (data.error || 'Could not process link.'));
            loader.style.display = 'none';
        }

    } catch (error) {
        console.error("Frontend Error:", error);
        alert('Make sure your backend server is running!');
        loader.style.display = 'none';
    }
});