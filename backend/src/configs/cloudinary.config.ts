import cloudinary from "cloudinary";
import config from ".";

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
    cloud_name: config.general.CLOUDINARY_NAME,
    api_key: config.general.CLOUDINARY_API_KEY,
    api_secret: config.general.CLOUDINARY_API_SECRET,
    // Return "https" URLs by setting secure: true
    secure: false,
});

export default cloudinaryV2;
