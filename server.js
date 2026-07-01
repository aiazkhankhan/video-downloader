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
            const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.play) {
                return res.json({ downloadUrl: response.data.data.play });
            }
        } catch (e) {
            console.log("TikTok Failed");
        }
    } 
    
    // 2. INSTAGRAM & FACEBOOK ENGINE (Solid Public Bypass)
    if (videoUrl.includes('instagram.com') || videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
        try {
            // Nayi premium fast working API
            const response = await axios.get(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.url) {
                return res.json({ downloadUrl: response.data.url });
            }
        } catch (e) {
            console.log("Instagram Engine 1 Failed, trying fallback...");
        }

        try {
            // Fallback Engine 2
            const response = await axios.get(`https://api.vkrdown.com/server?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.video) {
                return res.json({ downloadUrl: response.data.data.video });
            }
        } catch (err) {
            console.log("Instagram Engine 2 Failed");
        }
    }

    // 3. UNIVERSAL FALLBACK
    try {
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
        console.error("All Engines Failed:", error.message);
    }

    res.status(500).json({ error: 'Servers are currently busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;