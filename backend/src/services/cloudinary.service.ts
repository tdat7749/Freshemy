import cloudinaryV2 from "../configs/cloudinary.config";

export const uploadImageToCloudinary = async (file: string, folder: string): Promise<string> => {
    const result = await cloudinaryV2.uploader.upload(file, {
        folder: folder,
        public_id: `${Date.now()}`,
        upload_preset: "Freshemy",
    });
    if (result) {
        return result.url;
    }
    return result;
};
