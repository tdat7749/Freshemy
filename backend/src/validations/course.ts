import Joi from "joi"

type CreateCourse = {
    title: string,
    slug: string,
    summary: string,
    description: string,
    thumbnail: Express.Multer.File,
    categories: Array<number>,
}

export const createCourseSchema = Joi.object({

})