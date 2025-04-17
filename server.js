require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const { TikTokDL } = require('@tobyg74/tiktok-api-dl');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint untuk download YouTube
app.get('/api/youtube', async (req, res) => {
    try {
        const url = req.query.url;
        const format = req.query.format || 'mp4';
        
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'URL YouTube tidak valid' });
        }

        if (format === 'mp3') {
            const info = await ytdl.getInfo(url);
            res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
            ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
        } else {
            const info = await ytdl.getInfo(url);
            res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
            ytdl(url, { quality: 'highest' }).pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mendownload video' });
    }
});

// Endpoint untuk download TikTok
app.get('/api/tiktok', async (req, res) => {
    try {
        const url = req.query.url;
        const result = await TikTokDL(url);
        
        if (!result.status || !result.result) {
            return res.status(400).json({ error: 'Gagal memproses TikTok' });
        }

        const videoUrl = result.result.video[0];
        const response = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
        });

        res.header('Content-Disposition', `attachment; filename="tiktok_video.mp4"`);
        response.data.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mendownload video TikTok' });
    }
});

// Endpoint untuk halaman utama
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});