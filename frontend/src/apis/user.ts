import apiCaller from "../api-config/apiCaller";
import { ChangePassword as ChangePasswordType } from "../types/user";
import { HTTP_PATCH } from "../utils/contants";

const changePassword = async (values: ChangePasswordType) => {
    const path = "/users/change-password";

    const response = await apiCaller(HTTP_PATCH, path, values);

    return response;
};

const UserApis = {
    changePassword
};

export default UserApis;