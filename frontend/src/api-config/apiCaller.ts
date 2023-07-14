import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../apis/auth";

const axiosPublic = axios.create({
    baseURL: "http://localhost:3001/api",
});

const axiosApiInstance = axios.create();

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
    async (error: any) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config.sent) {
            config.sent = true;
            const response = await refreshToken();
            const accessToken = response.data.accessToken;

            axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
            return axiosApiInstance(config);
        }
        if (error) {
            return Promise.reject(error.response);
        }
        // return error;
    }
);

export const apiCaller = (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    return axiosPublic({
        method,
        headers: {
            Cookie: `rfToken=${refreshToken}`,
        },
        url: `${path}`,
        data,
    });
};

export default apiCaller;
