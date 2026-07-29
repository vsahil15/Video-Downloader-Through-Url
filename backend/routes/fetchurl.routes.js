import express from 'express';
import fs from 'fs';
// Use @distube/ytdl-core instead of ytdl-core to avoid 403/410 errors
import ytdl from '@distube/ytdl-core'; 

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

    // Validate if the URL is actually a YouTube link
    if (!ytdl.validateURL(url)) {
        return res.status(400).json({
            success: false,
            message: "Invalid YouTube URL"
        });
    }

    try {
        // Wrap the stream in a Promise so 'await' works correctly
        await new Promise((resolve, reject) => {
            const downloadStream = ytdl(url, { quality: 'highestvideo' });
            const fileStream = fs.createWriteStream('video.mp4');

            downloadStream.pipe(fileStream);

            fileStream.on('finish', () => {
                console.log('Download finished!');
                resolve();
            });

            // Catch errors on both the network stream and file system stream
            downloadStream.on('error', (err) => reject(err));
            fileStream.on('error', (err) => reject(err));
        });

        return res.status(200).json({
            success: true,
            message: "Downloaded successfully!"
        });

    } catch (err) {
        console.error("Download failed:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;
