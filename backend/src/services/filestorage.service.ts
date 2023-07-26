import fs from "fs";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffprobePath from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import configs from "../configs";

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

const bandwidthCalculation = (inputVideo: Express.Multer.File): Promise<number> => {
    return new Promise((resolve, rejects) => {
        ffmpeg.ffprobe(inputVideo.path, (error, metadata) => {
            if (error) {
                rejects(error);
            } else {
                const bandwidth: number = inputVideo.size / (metadata.format.duration as number);
                resolve(bandwidth);
            }
        });
    });
};

const createMainM3U8 = async (
    inputVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
): Promise<string> => {
    const ouputForMainM3U8 = `${outputFolderPath}\\${uuid}\\main.m3u8`;

    const bandwidth = await bandwidthCalculation(inputVideo);

    const streamInfoArray = resolutions.map((resolution) => {
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n video_${resolution}/video_${resolution}.m3u8`;
    });

    const mainM3U8Content = "#EXTM3U\n#EXT-X-VERSION:3\n" + streamInfoArray.join("\n");

    fs.writeFileSync(ouputForMainM3U8, mainM3U8Content);

    const publicUrlM3U8 = configs.general.PUBLIC_URL_FOLDER_VIDEOS + "/" + `${uuid}` + "/" + "main.m3u8";

    return publicUrlM3U8;
};

const createFileM3U8AndTS = async (
    inputVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
): Promise<string> => {
    resolutions.map((resolution) => {
        const videoPath = path.join(outputFolderPath, uuid, `video_${resolution}`);

        if (!fs.existsSync(videoPath)) {
            fs.mkdirSync(videoPath, { recursive: true });
        }

        const outputForM3U8 = `${videoPath}\\video_${resolution}.m3u8`;
        // const outputForTS = `${videoPath}\\video_%03d.ts`;

        ffmpeg(inputVideo.path)
            .outputOptions([`-s ${resolution}`, "-c:v h264", "-c:a aac", "-f hls", "-hls_time 10", "-hls_list_size 0"])
            .output(outputForM3U8)
            // .output(outputForTS)
            .on("end", () => console.log("end"))
            .on("error", (error) => console.log(error))
            .run();
    });

    return createMainM3U8(inputVideo, resolutions, outputFolderPath, uuid);
};

const FileStorageService = {
    createFileM3U8AndTS,
};

export default FileStorageService;
