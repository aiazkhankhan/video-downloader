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

    // --- API 1: TikWM (Primary) ---
    try {
        console.log("Trying TikWM API...");
        const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
        if (response.data && response.data.data && response.data.data.play) {
            console.log("Success with TikWM!");
            return res.json({ downloadUrl: response.data.data.play });
        }
    } catch (e) {
        console.log("TikWM Failed, trying backup API...");
    }

    // --- API 2: Dongis (Backup) ---
    try {
        console.log("Trying Backup API...");
        const backupResponse = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(videoUrl)}`);
        
        if (backupResponse.data && backupResponse.data.video && backupResponse.data.video.noWatermark) {
            console.log("Success with Backup API!");
            return res.json({ downloadUrl: backupResponse.data.video.noWatermark });
        }
    } catch (error) {
        console.error("Both APIs Failed:", error.message);
    }

    // Agar dono fail ho jayein
    res.status(500).json({ error: 'Both download servers are busy. Please try another video link!' });
});

app.listen(PORT, () => {
    console.log(`Balle Balle! Server is running on http://localhost:${PORT}`);
});