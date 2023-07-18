import apiCaller from "../api-config/apiCaller";
import { Register as RegisterType, Login as LoginType, ResetPassword as ResetPasswordType } from "../types/auth";
import { HTTP_GET, HTTP_POST } from "../utils/contants";

export const login = async (values: LoginType) => {
    const path = "auth/login";
    const data = {
        email: values.email,
        password: values.password,
    };

    const response = await apiCaller(HTTP_POST, path, data);
    return response;
};

export const register = async (values: RegisterType) => {
    const path = "/auth/signup";

    const data: RegisterType = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
    };

    const response = await apiCaller(HTTP_POST, path, data);
    return response;
};

export const getMe = async () => {
    const path = "auth/me";
    const response = await apiCaller(HTTP_GET, path);
    return response;
};

export const forgotPassword = async (email: string) => {
    const path = "auth/forgot-password";
    const data = {
        email,
    };
    const response = await apiCaller(HTTP_POST, path, data);
    return response;
};

export const resetPassword = async (values: ResetPasswordType) => {
    const path = `auth/reset-password`;
    const data = {
        confirmPassword: values.confirmPassword,
        password: values.password,
        token: values.token,
    };
    const response = await apiCaller(HTTP_POST, path, data);
    return response;
};

export const refreshToken = async () => {
    const path = "auth/refresh";

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

export const verifyEmail = async (token: string) => {
    const path = `auth/verify-email/${token}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};
