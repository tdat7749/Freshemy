import fs from 'fs'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'


ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

const bandwidthCalculation = (inputVideo: Express.Multer.File) => {
    let bandwidth
    ffmpeg.ffprobe(inputVideo.path, (error, metadata) => {
        if (error) {
            throw new Error("Error getting video metadata")
        } else {
            bandwidth = inputVideo.size / (metadata.format.duration as number)
        }
    })
    console.log(bandwidth)
    return bandwidth
}

const createMainM3U8 = (inputVideo: Express.Multer.File, resolutions: string[], outputFolderPath: string, titleLesson: string) => {
    const ouputForMainM3U8 = `${outputFolderPath}\\${titleLesson}\\main.m3u8`

    const streamInfoArray = resolutions.map((resolution) => {
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidthCalculation(inputVideo)},RESOLUTION=${resolution}\n${titleLesson}/video_${resolution}/video_${resolution}.m3u8`;
    });

    const mainM3U8Content = '#EXTM3U\n#EXT-X-VERSION:3\n' + streamInfoArray.join('\n');

    fs.writeFileSync(ouputForMainM3U8, mainM3U8Content);
    return ouputForMainM3U8
}


const createFileM3U8AndTS = (inputVideo: Express.Multer.File, resolutions: string[], outputFolderPath: string, titleLesson: string) => {

    resolutions.map((resolution) => {

        const videoPath = path.join(outputFolderPath, titleLesson, `video_${resolution}`)

        if (!fs.existsSync(videoPath)) {
            fs.mkdirSync(videoPath, { recursive: true })
        }

        const outputForM3U8 = `${videoPath}\\video_${resolution}.m3u8`
        // const outputForTS = `${videoPath}\\video_%03d.ts`

        ffmpeg(inputVideo.path)
            .outputOptions([`-s ${resolution}`, '-c:v h264', '-c:a aac', '-f hls', '-hls_time 10', '-hls_list_size 0'])
            .output(outputForM3U8)
            // .output(outputForTS)
            .on('end', () => console.log("end"))
            .on('error', (error) => console.log(error))
            .run()
    })

    return createMainM3U8(inputVideo, resolutions, outputFolderPath, titleLesson)
}

const FileStorageService = {
    createFileM3U8AndTS
}

export default FileStorageService