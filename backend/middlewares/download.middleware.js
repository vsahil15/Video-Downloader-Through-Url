import fs from "fs";
import { Readable } from "stream";
import { finished } from "stream/promises";
import path from "path";
import { Innertube } from "youtubei.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

// Set path to the static ffmpeg binary downloaded for this platform
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Extracts the YouTube Video ID from various YouTube URL formats.
 * @param {string} url - The URL to extract ID from
 * @returns {string|null} - The 11-character video ID, or null if not a YouTube link
 */
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Helper function to merge separate video and audio streams using FFmpeg.
 */
function mergeStreams(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions("-c copy") // Direct stream copy without re-encoding (very fast)
            .outputOptions("-map 0:v:0") // Take video from first input
            .outputOptions("-map 1:a:0") // Take audio from second input
            .save(outputPath)
            .on("end", () => resolve(outputPath))
            .on("error", (err) => reject(err));
    });
}

/**
 * Downloads a video/file from a URL (supports YouTube URLs and direct links) 
 * and saves it to a temp directory.
 * @param {string} url - The URL of the video to download
 */
export async function download(url) {
    // Ensure temp directory exists
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const finalPath = path.join(tempDir, "video.mp4");
    const ytId = getYouTubeId(url);

    if (ytId) {
        console.log(`Detected YouTube URL. Extracting video ID: ${ytId}`);
        
        // Initialize Innertube YouTube Client
        const youtube = await Innertube.create();
        
        // Get Video Information
        const videoInfo = await youtube.getInfo(ytId);
        
        // 1. Select the best video-only stream format
        const videoFormat = videoInfo.chooseFormat({
            type: "video",
            quality: "best",
            format: "any"
        });

        // 2. Select the best audio-only stream format (with fallback if no audio stream exists)
        let audioFormat;
        let hasAudio = true;
        try {
            audioFormat = videoInfo.chooseFormat({
                type: "audio",
                quality: "best",
                format: "any"
            });
        } catch (e) {
            console.log("No audio format available. Downloading silent video.");
            hasAudio = false;
        }

        // Delete final output file if it already exists to avoid FFmpeg collision
        if (fs.existsSync(finalPath)) {
            fs.unlinkSync(finalPath);
        }

        if (hasAudio) {
            console.log(`Selected Video format: itag=${videoFormat.itag}, mime=${videoFormat.mime_type}`);
            console.log(`Selected Audio format: itag=${audioFormat.itag}, mime=${audioFormat.mime_type}`);

            const tempVideoPath = path.join(tempDir, "temp_video.mp4");
            const tempAudioPath = path.join(tempDir, "temp_audio.mp4");

            // Delete temp files if they exist from previous failed downloads
            if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
            if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);

            // Download Video track
            console.log("Downloading video stream...");
            const videoStream = await youtube.download(ytId, { format: videoFormat });
            const videoFile = fs.createWriteStream(tempVideoPath);
            await finished(Readable.fromWeb(videoStream).pipe(videoFile));

            // Download Audio track
            console.log("Downloading audio stream...");
            const audioStream = await youtube.download(ytId, { format: audioFormat });
            const audioFile = fs.createWriteStream(tempAudioPath);
            await finished(Readable.fromWeb(audioStream).pipe(audioFile));

            // Merge both streams using static FFmpeg
            console.log("Merging audio and video tracks...");
            await mergeStreams(tempVideoPath, tempAudioPath, finalPath);
            console.log("Merging complete!");

            // Clean up temporary streams
            try {
                fs.unlinkSync(tempVideoPath);
                fs.unlinkSync(tempAudioPath);
            } catch (err) {
                console.error("Warning: Failed to clean up temp files:", err.message);
            }
        } else {
            // If the video is silent, just download the video track directly
            console.log(`Downloading video-only stream: itag=${videoFormat.itag}`);
            const videoStream = await youtube.download(ytId, { format: videoFormat });
            const videoFile = fs.createWriteStream(finalPath);
            await finished(Readable.fromWeb(videoStream).pipe(videoFile));
            console.log("Video download complete!");
        }

        console.log("YouTube download complete!");
    } else {
        console.log("Detected direct URL. Downloading file directly...");
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        // Convert Web Stream to Node.js stream so we can pipe it
        const body = Readable.fromWeb(response.body);
        
        await finished(body.pipe(file));
        console.log("Direct download complete!");
    }

    return finalPath;
}
