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

    // 1. TIKTOK ENGINE (Working 100%)
    if (videoUrl.includes('tiktok.com')) {
        try {
            const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.play) {
                return res.json({ downloadUrl: response.data.data.play });
            }
        } catch (e) {
            console.log("TikTok Backend Failed");
        }
    } 
    
    // 2. INSTAGRAM & FACEBOOK UNIVERSAL PARSER (High-Success rate)
    if (videoUrl.includes('instagram.com') || videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
        try {
            // Yeh engine cloud computing environment use karta hai bina kisi IP block ke
            const response = await axios.get(`https://api.vkrdown.com/server?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.video) {
                return res.json({ downloadUrl: response.data.data.video });
            }
        } catch (err) {
            console.log("Primary Instagram Engine Failed, trying backup...");
        }

        try {
            // Backup Engine 2
            const response = await axios.get(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.url) {
                return res.json({ downloadUrl: response.data.url });
            }
        } catch (e) {
            console.log("Backup Instagram Engine Failed");
        }
    }

    // 3. COBALT ENGINE FALLBACK
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