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

    // 1. TIKTOK KE LIYE (TikWM - 100% Working)
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
    
    // 2. INSTAGRAM & FACEBOOK KE LIYE (LATEST BYPASS ENGINE)
    if (videoUrl.includes('instagram.com') || videoUrl.includes('facebook.com')) {
        try {
            console.log("Trying High-Success Instagram API...");
            // Yeh server direct SnapInsta ke engine ko call karta hai jo block nahi hota
            const response = await axios.get(`https://api.sandipbaruwal.codes/insta/download?url=${encodeURIComponent(videoUrl)}`);
            
            if (response.data && response.data.url) {
                return res.json({ downloadUrl: response.data.url });
            }
        } catch (e) {
            console.log("Primary Instagram API Failed, trying backup...");
        }

        // Instagram Backup 2 (Publer Bypass Script)
        try {
            console.log("Trying Backup Engine...");
            const response = await axios.get(`https://api.vkrdown.com/server?url=${encodeURIComponent(videoUrl)}`);
            if (response.data && response.data.data && response.data.data.video) {
                return res.json({ downloadUrl: response.data.data.video });
            }
        } catch (err) {
            console.log("All Instagram Engines Failed");
        }
    }

    // 3. UNIVERSAL FALLBACK (Cobalt)
    try {
        console.log("Trying Cobalt Fallback...");
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
        console.error("Fallback API Error:", error.message);
    }

    // Agar sab fail ho jayein
    res.status(500).json({ error: 'Both download servers are busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;