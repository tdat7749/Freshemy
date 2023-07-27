import { apiCaller } from "@src/api-config";
import { ChangePassword as ChangePasswordType, UpdateInformation as UpdateInformationType } from "../types/user";

import i18n from "../utils/i18next";

const changePassword = async (values: ChangePasswordType) => {
    const path = "/users/change-password";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PATCH"), path, values);

    return response;
};

const getInformation = async () => {
    const path = "/users/me";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const updateInformation = async (values: UpdateInformationType) => {
    const path = "/users/change-information";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, values);

    return response;
};

const UserApis = {
    changePassword,
    getInformation,
    updateInformation,
};

export default UserApis;
