import { v2 as cloudinary } from "cloudinary";
import config from ".";
import multer from 'multer'


cloudinary.config({
    cloud_name: config.general.CLOUDINARY_NAME,
    api_key: config.general.CLOUDINARY_API_KEY,
    api_secret: config.general.CLOUDINARY_API_SECRET,
    // Return "https" URLs by setting secure: true
    secure: false,
});



const storage = multer.diskStorage({
    filename: (req, file: Express.Multer.File, cb) => {
        cb(null, "/tmp/")
    },
})

export const upload = multer({
    storage: storage,
    limits: {
        fieldSize: (1024 * 1024) * 4 //4MB
    }
})

export default cloudinary;
