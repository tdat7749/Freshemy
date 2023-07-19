import { RequestHasLogin } from "../types/request";
import { uploadFile, uploadVideo } from "../configs/multer.config";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";
// import { MESSAGE_ERROR_INTERNAL_SERVER } from "src/utils/constant";

export const uploadVideoMdw = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    if (req.file) {
        uploadVideo(req, res, (error: any) => {
            if (error instanceof MulterError) {
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
            }
            next();
        });
    }
    next();
};

export const uploadFileMdw = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    uploadFile(req, res, (error: any) => {
        if (error instanceof MulterError) {
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
        }
        next();
    });
};
