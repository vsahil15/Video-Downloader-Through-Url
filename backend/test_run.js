import { Innertube } from 'youtubei.js';

async function test() {
    try {
        console.log("Initializing Innertube with ANDROID...");
        const youtube = await Innertube.create({ clientType: 'ANDROID' });
        const videoInfo = await youtube.getInfo('aqz-KE-bpKQ');
        const videoFormat = videoInfo.chooseFormat({
            type: "video",
            quality: "best",
            format: "any"
        });
        console.log("videoFormat properties for ANDROID client:");
        console.log(JSON.stringify(videoFormat, null, 2));
    } catch (err) {
        console.error(err);
    }
}

test();
