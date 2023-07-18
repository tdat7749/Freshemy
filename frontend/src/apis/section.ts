import { AddSection as AddSectionType } from "../types/section";
// import apiCaller from "../api-config/apiCaller";
// import { HTTP_POST } from "../utils/contants";

export const addSection = async (values: AddSectionType) => {
    // const path = "/api/sections";
    // const response = await apiCaller(HTTP_POST, path, values);
    const response = {
        success: true,
        message: "Add section successfully",
        status_code: 200,
    };

    return response;
};
