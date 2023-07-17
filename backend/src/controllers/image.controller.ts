import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export class ImagesController {
    async get(req: Request, res: Response, next: NextFunction) {
        const { type, id } = req.params;
        const imageTypes = ['authors', 'books'];

        if (!imageTypes.includes(type)) {
            return res.status(500).json({ message: 'Invalid image type' });
        }

        const filePath = path.join(__dirname, '../../../uploads', type, id);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Invalid image' });
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                return res.status(404).json({ message: 'Invalid image / image read error' });
            }
            res.set('Content-Type', 'image/jpeg');
            res.send(data);
        });
    }
}

export default ImagesController;
