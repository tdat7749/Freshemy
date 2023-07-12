import axios from "axios";
import { axiosPublic } from "./axiosPublic";
import Cookies from "js-cookie";

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

// axiosPublic.interceptors.response.use(
//     (response) => response,
//     async (error: any) => {
//         const config = error?.config;

//         if (error?.response.status === 401 && !config.sent) {
//             config.sent = true;

//             //gọi refresh token
//         }
//     }
// );

export const apiCaller = (method: string, path: string, data?: any) => {
    return axios({
        method,
        url: `http://localhost:3001/api/${path}`,
        data,
    });
};

export default apiCaller;
