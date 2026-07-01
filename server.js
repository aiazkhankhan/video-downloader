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

    // 1. TIKTOK ENGINE
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
    
    // 2. INSTAGRAM & FACEBOOK (Direct Processing Engine)
    if (videoUrl.includes('instagram.com') || videoUrl.includes('facebook.com')) {
        try {
            console.log("Trying High-Speed Specialized API...");
            // Yeh server direct cloud server data use karta hai bina restriction ke
            const response = await axios.get(`https://api.dilrong.workers.dev/download?url=${encodeURIComponent(videoUrl)}`);
            
            if (response.data && response.data.url) {
                return res.json({ downloadUrl: response.data.url });
            }
            if (response.data && response.data.data && response.data.data.url) {
                return res.json({ downloadUrl: response.data.data.url });
            }
        } catch (e) {
            console.log("Primary Multi-API Failed, trying global fallback...");
        }

        // Ultimate Fallback Engine
        try {
            const response = await axios.get(`https://api.snapsave.workers.dev/?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.url) {
                return res.json({ downloadUrl: response.data.url });
            }
        } catch (err) {
            console.log("Fallback Engine Failed");
        }
    }

    // 3. COBALT ENGINE AS FINAL RESORT
    try {
        console.log("Trying Cobalt...");
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
        console.error("All APIs failed to parse video url:", error.message);
    }

    // Agar sab fail ho jayein
    res.status(500).json({ error: 'Both download servers are busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;