import { AddSection as AddSectionType } from "../types/section";
import apiCaller from "../api-config/apiCaller";
import { HTTP_DELETE, HTTP_POST, HTTP_PUT } from "../utils/contants";

export const addSection = async (values: AddSectionType) => {
    const path = "/sections";
    const response = await apiCaller(HTTP_POST, path, values);
    return response;
};

export const editSection = async (id: number) => {
    const path = `/sections/${id}`;
    const response = await apiCaller(HTTP_PUT, path);
    return response;
};

export const deleteSection = async (id: number) => {
    const path = `/sections/${id}`;
    const response = await apiCaller(HTTP_DELETE, path);
    return response;
};
