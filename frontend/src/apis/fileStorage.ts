import { UploadFile as UploadFileType } from "../types/filestorage";
import { apiCaller } from "@src/api-config";
import i18n from "../utils/i18next";

const uploadFile = async (values: UploadFileType) => {
    const path = "fileStorage/";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);
    return response;
};

const uploadAvatar = async (values: UploadFileType) => {
    const path = "fileStorage/avatar";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);
    return response;
};

const FileStorageApis = {
    uploadFile,
    uploadAvatar,
};

export default FileStorageApis;
