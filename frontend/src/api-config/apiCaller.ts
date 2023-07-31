import axios from "axios";
import Cookies from "js-cookie";
import { AuthApis } from "@src/apis";

const axiosPublic = axios.create({
    baseURL: "http://localhost:3001/api/",
});

const axiosInstance = axios.create();

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
        if (error?.response?.status === 401 && !config._retry) {
            config._retry = true;
            const response = await AuthApis.refreshToken();
            const accessToken = response.data.data.accessToken;
            if (accessToken) {
                Cookies.set("accessToken", accessToken);
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${accessToken}`,
                };
                return axiosInstance(config);
            }
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
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            rftoken: `rfToken=${refreshToken}`,
        },
        url: `${path}`,
        data,
    });
};

export default apiCaller;
