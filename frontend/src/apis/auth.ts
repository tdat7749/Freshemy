import apiCaller from "../api-config/apiCaller";

export const login = async (email: string, password: string) => {
    const path = "auth/login";
    const data = {
        email,
        password,
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
