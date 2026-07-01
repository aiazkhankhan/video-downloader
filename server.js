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

    // 1. TIKTOK KE LIYE (TikWM)
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
    
    // 2. INSTAGRAM KE LIYE (Specialized Insta API)
    if (videoUrl.includes('instagram.com')) {
        try {
            console.log("Trying Instagram Dedicated API...");
            const response = await axios.get(`https://api.vkrdown.com/insta?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.video) {
                return res.json({ downloadUrl: response.data.data.video });
            }
        } catch (e) {
            console.log("Instagram Dedicated API Failed, trying Cobalt...");
        }
    }

    // 3. FACEBOOK & FALLBACK (Cobalt Engine)
    try {
        console.log("Trying Cobalt API...");
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: videoUrl,
            filenamePattern: 'basic'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data && response.data.url) {
            return res.json({ downloadUrl: response.data.url });
        }
    } catch (error) {
        console.error("Cobalt API Error:", error.message);
    }

    // Agar sab fail ho jayein
    res.status(500).json({ error: 'Both download servers are busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});