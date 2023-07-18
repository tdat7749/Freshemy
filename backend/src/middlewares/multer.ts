import { RequestHasLogin } from "../types/request";
import { upload } from "../configs/cloudinary.config";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";
// import { MESSAGE_ERROR_INTERNAL_SERVER } from "src/utils/constant";

export const uploadFile = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    upload(req, res, (error: any) => {
        if (error instanceof MulterError) {
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
        }

        next();
    });
};
