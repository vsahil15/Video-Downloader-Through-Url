import express from 'express';
import { downloadVideo, downloadPlaylist } from "ytsave";
//const fs = require('fs');
//const ytdl = require('ytdl-core');
import fs from 'fs';
import ytdl from 'ytdl-core';

const router = express.Router();

router.post('/', async (req, res) => {
    console.log("POST /fetch_url hit with body:", req.body);
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({
            success: false,
            message: "url is required"
        });
    }
    try {
       /* const filePath = await downloadVideo(url,
             {
                format: "mp4",
                output: "./videos",
             });*/
     await  ytdl(url, { quality: 'highest' })
        .pipe(fs.createWriteStream('video.mp4'))
        .on('finish', () => {
        console.log('Download finished!');
  });
        return res.status(200).json({
            success: true,
            message: "Downloaded successfully!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;
