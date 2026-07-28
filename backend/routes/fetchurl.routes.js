import express from 'express';
import { download } from '../middlewares/download.middleware.js';

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
        const filePath = await download(url);
        return res.status(200).json({
            success: true,
            message: "Downloaded successfully!",
            path: filePath
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;
