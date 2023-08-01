import fs from "fs";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffprobePath from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import configs from "../configs";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse, DeleteApiResponse } from "cloudinary";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import i18n from "../utils/i18next";

import { RequestHasLogin } from "../types/request";
import { getPublicIdFromUrl } from "../utils/helper";
import services from ".";

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
    //if local use this
    //const ouputForMainM3U8 = `${outputFolderPath}\\${uuid}\\main.m3u8`;

    //if deploy to vps (linux) use this
    const ouputForMainM3U8 = `${outputFolderPath}/${uuid}/main.m3u8`;

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

        //if local use this
        //const outputForM3U8 = `${videoPath}\\video_${resolution}.m3u8`;

        //if deploy to vps (linux) use this
        const outputForM3U8 = `${videoPath}/video_${resolution}.m3u8`;

        ffmpeg(inputVideo.path)
            .outputOptions([`-s ${resolution}`, "-c:v h264", "-c:a aac", "-f hls", "-hls_time 10", "-hls_list_size 0"])
            .output(outputForM3U8)
            .on("end", () => console.log("end"))
            .on("error", (error) => console.log(error))
            .run();
    });

    return createMainM3U8(inputVideo, resolutions, outputFolderPath, uuid);
};

const uploadImageToCloudinary = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const uploadResponse = await new Promise<null | UploadApiResponse>((resolve, rejects) => {
            cloudinary.uploader.upload(
                req.file?.path as string,
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        rejects(error);
                    } else {
                        resolve(result);
                    }
                },
            );
        });
        if (uploadResponse) {
            return new ResponseSuccess(201, i18n.t("successMessages.imageUploadSuccess"), true, uploadResponse);
        }
        return new ResponseError(400, i18n.t("errorMessages.imageUploadError"), false);
    } catch (error: any) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const uploadAvatarToCloudinary = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { user_id } = req.body;
        const userId = parseInt(user_id);
        const isFoundUserById = await configs.db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!isFoundUserById) {
            return new ResponseError(400, i18n.t("errorMessages.UserNotFound"), false);
        }

        const uploadResponse = await new Promise<null | UploadApiResponse>((resolve, rejects) => {
            cloudinary.uploader.upload(
                req.file?.path as string,
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        rejects(error);
                    } else {
                        resolve(result);
                    }
                },
            );
        });
        if (uploadResponse) {
            await destroyImageInCloudinary(isFoundUserById.url_avatar as string);
            const isUpdateAvatar = await configs.db.user.update({
                where: {
                    id: isFoundUserById.id,
                },
                data: {
                    url_avatar: uploadResponse.url,
                },
            });
            if (!isUpdateAvatar) return new ResponseError(400, i18n.t("errorMessages.missingRequestBody"), false);
            return new ResponseSuccess(201, i18n.t("successMessages.imageUploadSuccess"), true, uploadResponse.url);
        }

        return new ResponseError(400, i18n.t("errorMessages.imageUploadError"), false);
    } catch (error: any) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const destroyImageInCloudinary = async (url: string): Promise<boolean> => {
    try {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
            const isDestroy = await new Promise<null | DeleteApiResponse>((resolve, rejects) => {
                cloudinary.uploader.destroy(publicId, {}, (error: any, result: DeleteApiResponse) => {
                    if (error) {
                        rejects(error);
                    } else {
                        resolve(result);
                    }
                });
            });
            if (isDestroy !== null) {
                return true;
            }
        }
        return false;
    } catch (error: any) {
        return false;
    }
};

const FileStorageService = {
    uploadAvatarToCloudinary,
    createFileM3U8AndTS,
    uploadImageToCloudinary,
    destroyImageInCloudinary,
};

export default FileStorageService;
