import { v2 as cloudinary } from "cloudinary";
import config from ".";

cloudinary.config({
    cloud_name: config.general.CLOUDINARY_NAME,
    api_key: config.general.CLOUDINARY_API_KEY,
    api_secret: config.general.CLOUDINARY_API_SECRET,
    // Return "https" URLs by setting secure: true
    secure: false,
});

export default cloudinary;
