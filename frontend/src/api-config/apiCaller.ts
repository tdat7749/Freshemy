import axios from "axios";
import Cookies from "js-cookie";
import { authActions } from "../redux/slice";

const axiosPublic = axios.create({
    baseURL: "http://localhost:3001/api",
});

axiosPublic.interceptors.request.use(
    async (config: any) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${accessToken}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosPublic.interceptors.response.use(
    (response) => response,
    (error: any) => {
        const config = error?.config;

        if (error?.response?.status === 401 && !config.sent) {
            config.sent = true;
            authActions.refreshToken();
        }

        if (error) {
            return Promise.reject(error.response);
        }
        // return error;
    }
);

export const apiCaller = (method: string, path: string, data?: any) => {
    return axiosPublic({
        method,
        url: `${path}`,
        data,
    });
};

export default apiCaller;
