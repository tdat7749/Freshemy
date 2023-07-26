import { HTTP_POST } from "../utils/contants";
import { UploadFile as UploadFileType } from "../types/filestorage";
import apiCaller from "../api-config/apiCaller";

const uploadFile = async (values: UploadFileType) => {
    const path = "fileStorage/";

    const response = await apiCaller(HTTP_POST, path, values);
    return response;
};

const FileStorageApis = {
    uploadFile,
};

export default FileStorageApis;
