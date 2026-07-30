import express from 'express';
import ytDlpPackage from 'yt-dlp-exec';
import path from 'path';

const { exec: ytDlp } = ytDlpPackage;
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
        const rootDir = process.cwd().endsWith('backend') 
            ? path.join(process.cwd(), '..') 
            : process.cwd();

        const exePath = path.join(rootDir, 'yt-dlp.exe');
        
        // Changing file extension pattern to mp4 explicitly
        const outputPattern = path.join(rootDir, '%(title)s.mp4');

        console.log("Starting full HD video + audio download...");

        await ytDlp(url, {
            output: outputPattern,
            // Downloads Best Video and Best Audio separately, then merges them
            format: 'bv+ba/b', 
            // Automatically converts the container to an MP4 video file
            mergeOutputFormat: 'mp4',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            noCheckCertificates: true,
        }, {
            binaryPath: exePath 
        });

        console.log('Download and track merging finished successfully!');

        return res.status(200).json({
            success: true,
            message: "Downloaded video with working audio successfully!"
        });

    } catch (err) {
        console.error("yt-dlp download failed:", err);
        return res.status(500).json({
            success: false,
            message: err.stderr || err.message || "An error occurred during download."
        });
    }
});

export default router;
