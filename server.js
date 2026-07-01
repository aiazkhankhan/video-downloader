const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl) return res.status(400).json({ error: 'URL is required' });

    // 1. TIKTOK ENGINE (100% Working)
    if (videoUrl.includes('tiktok.com')) {
        try {
            console.log("Trying TikTok API...");
            const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.play) {
                return res.json({ downloadUrl: response.data.data.play });
            }
        } catch (e) {
            console.log("TikTok API Failed");
        }
    } 
    
    // 2. INSTAGRAM PREMIUM BYPASS (Stable Cloud Engine)
    if (videoUrl.includes('instagram.com')) {
        try {
            console.log("Trying Premium Instagram Scraper...");
            // Yeh engine bina proxy block ke direct raw CDN video link uthata hai
            const options = {
                method: 'GET',
                url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
                params: { url: videoUrl },
                headers: {
                    'x-rapidapi-key': 'd6b9d6eb4fmshbcae973e4b78deep1772bfjsn630ec8b74da1',
                    'x-rapidapi-host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            if (response.data && response.data.media) {
                return res.json({ downloadUrl: response.data.media });
            }
        } catch (error) {
            console.error("Premium Scraper Failed:", error.message);
        }
    }

    // Agar sab fail ho jayein
    res.status(500).json({ error: 'Both download servers are busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;