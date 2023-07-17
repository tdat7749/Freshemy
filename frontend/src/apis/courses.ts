import apiCaller from "../api-config/apiCaller";
import { HTTP_GET } from "../utils/contants";

export const getMyCourses = async (page_index: number, keyword: string) => {
    const path = `/api/courses/search-my-courses?pageIndex=${page_index}&keyword=${keyword}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};
