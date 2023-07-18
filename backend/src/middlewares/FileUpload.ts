import crypto from 'crypto';
import fs from 'fs';
import multer, { StorageEngine } from 'multer';
import path from 'path';

export default class FileUploader {
    private storage: StorageEngine;

    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const folder = path.resolve(`uploads/course-thumbnails`);
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                }
                cb(null, folder);
            },
            filename: (req, file, callback) => {
                const fileName =
                    crypto.randomBytes(16).toString('hex') +
                    path.extname(file.originalname);
                callback(null, fileName);
            },
        });
    }

    public uploadImage(file: Express.Multer.File, folderName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const upload = multer({ storage: this.storage }).single('file');

            const req: any = { file };
            const res: any = {}; // Create a mock response object

            upload(req, res, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(req.file.filename);
                }
            });
        });
    }
}
