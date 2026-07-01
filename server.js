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

    // 1. Agar TikTok ka link ho (TikWM sab se best hai TikTok ke liye)
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
    
    // 2. Instagram aur Facebook ke liye (Universal Social Downloader API)
    try {
        console.log("Trying Social Downloader API...");
        // Yeh high-speed fallback API hai jo FB/Insta dono ko support karti hai
        const response = await axios.get(`https://api.vkrdown.com/server?url=${encodeURIComponent(videoUrl)}`);
        
        if (response.data && response.data.data && response.data.data.video) {
            return res.json({ downloadUrl: response.data.data.video });
        }
    } catch (error) {
        console.error("Social Downloader API Error:", error.message);
    }

    // Agar upar wali API fail ho toh Yeh Backup Multi-Downloader API hai
    try {
        console.log("Trying Backup Multi-Downloader...");
        const response = await axios.get(`https://api.cors.io/download?url=${encodeURIComponent(videoUrl)}`);
        if (response.data && response.data.url) {
            return res.json({ downloadUrl: response.data.url });
        }
    } catch (err) {
        console.error("Backup API Error:", err.message);
    }

    // Agar saari APIs fail ho jayein
    res.status(500).json({ error: 'Both download servers are busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});