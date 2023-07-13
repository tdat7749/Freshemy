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

    const data = {
        first_name: values.first_name, 
        last_name: values.last_name,
        email: values.email,
        password: values.password,
    };

    const response = await apiCaller("POST", path, data);
    return response;
};

export const getMe = async () => {
    const path = "auth/me";

    const response = await apiCaller("GET", path);

    return response;
};

export const refreshToken = async () => {
    const path = "auth/refresh";

    const response = await apiCaller("GET", path);

    return response;
};
