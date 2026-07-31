import express from 'express';
import ytDlpPackage from 'yt-dlp-exec';
import path from 'path';
import fs from 'fs'; 


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
          const tempFileName = `download-${Date.now()}.mp4`;
        const outputPattern = path.join(rootDir, tempFileName);

        console.log("Starting full HD video + audio download...");

    const fetchdata=  await ytDlp(url, {
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

        console.log('Download and track merging finished successfully!',fetchdata);
        
        return res.download(outputPattern,'video.mp4',(err)=>{
            if(err){
                console.error("Error sending file:", err);
            }


         if (fs.existsSync(outputPattern)) {
         fs.unlinkSync(outputPattern);
         console.log("Temporary file cleared from server disk space.");
         }
       });
     } 
     catch (err) {
        console.error("yt-dlp download failed:", err);
        return res.status(500).json({
            success: false,
            message: err.stderr || err.message || "An error occurred during download."
        });
    }
});

export default router;
