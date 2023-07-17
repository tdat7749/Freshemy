// import apiCaller from "../api-config/apiCaller";
// import { HTTP_GET } from "../utils/contants";

export const getMyCourses = async (page_index: number, keyword: string) => {
    // const path = `/api/courses/search-my-courses?pageIndex=${page_index}&keyword=${keyword}`;

    // const response = await apiCaller(HTTP_GET, path);
    const response = {
        success: true,
        message: "Get course successful",
        status: 200,
        data: {
            total_page: 4,
            total_record: 20,
            courses: [
                {
                    id: 1,
                    title: "Khóa học MYSQL dành cho newbie",
                    summary: "Đây là khóa học rẻ chưa từng có",
                    rate: 5,
                    author: "Duong Song",
                    category: ["NodeJS, MYSQL"],
                    number_section: 10,
                    slug: "slug-template",
                },
                {
                    id: 2,
                    title: "Khóa học MYSQL dành cho newbie 2",
                    summary: "Đây là khóa học rẻ chưa từng có",
                    rate: 5,
                    author: "Duong Song",
                    category: ["NodeJS, MYSQL"],
                    number_section: 10,
                    slug: "slug-template",
                },
                {
                    id: 3,
                    title: "Khóa học MYSQL dành cho newbie 3",
                    summary: "Đây là khóa học rẻ chưa từng có",
                    rate: 5,
                    author: "Duong Song",
                    category: ["NodeJS, MYSQL"],
                    number_section: 10,
                    slug: "slug-template",
                },
            ],
            message: "Get course successfully"
        },
    };
    return response;
};
