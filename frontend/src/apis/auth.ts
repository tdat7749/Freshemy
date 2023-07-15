import apiCaller from "../api-config/apiCaller";
import { Register as RegisterType } from "../types/auth";

export const login = async (email: string, password: string) => {
    const path = "auth/login";
    const data = {
        email,
        password,
    };

    const response = await apiCaller("POST", path, data);
    return response;
};


export const register = async (values: RegisterType) => {
    const path = "/auth/signup";

    const data: RegisterType = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password
    };

    const response = await apiCaller("POST", path, data);
    return response;
};

export const getMe = async () => {
    const path = "auth/me";
    const response = await apiCaller("GET", path);
    return response;
};

export const forgotPassword = async (email: string) => {
    const path = "auth/forgot-password";
    const data = {
        email,
    };
    const response = await apiCaller("POST", path, data);
    return response;
};

export const resetPassword = async (confirmPassword: string, password: string, token: string) => {
    const path = `auth/reset-password`;
    const data = {
        confirmPassword,
        password,
        token
    };
    const response = await apiCaller("POST", path, data);
    return response;
};

export const refreshToken = async () => {
    const path = "auth/refresh";

    const response = await apiCaller("GET", path);

    return response;
};

export const verifyEmail = async (token: string) => {
    const path = `auth/verifyEmail/${token}`

    const response = await apiCaller("GET", path)

    return response
}