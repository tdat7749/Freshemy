import { RequestHasLogin } from "../types/request";
import { CreateCourse } from "../types/course";
import { ResponseBase } from "../commons/response";
import { db } from "../configs/db.config";

export const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { title, slug, status, description, summary, categories, thumbnail }: CreateCourse = req.body;

    const isFoundCourse = await db.course.create({
        data: {
            title: title,
            slug: slug,
            status: status,
            description: description,
            summary: summary,
            thumbnail: thumbnail,
            courses_categories: {
                create: [],
            },
        },
    });
};
