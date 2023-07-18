import { Request } from "express";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response"
import { db } from '../configs/db.config'
import { 
    CourseDetailResponseData,
    Lesson,
    Section,
    Category
 } from "../types/courseDetail";
import { RequestHasLogin } from "../types/request";

const getCourseDetail = async (req: Request): Promise<ResponseBase>=>{
    try {
        const {slug} = req.params
        const course = await db.course.findFirst({
            where: {
                slug: slug,
            },
            include:{
                courses_categories:{
                    include:{
                        category:{
                            select:{
                                id:true,
                                title:true
                            }
                        }
                    }
                },
                sections:{
                    select:{
                        title:true,
                        updated_at:true,
                        lessions:{
                            select:{
                                title:true,
                                url_video:true
                            }
                        }
                    }
                },
                user:{
                    select:{
                        first_name:true,
                        last_name:true,
                        id:true,
                    }
                }
            }
        });   
        
        if(course){
            console.log('course sections',course.sections)
            const categories: Category[]= []
            const sections: Section[]=[]
            course.courses_categories.forEach(category=>{
                categories.push(category.category)
            })
            course.sections.forEach(section=>{
                const lessons: Lesson[]=[]
                section.lessions.forEach(lesson=>{
                    lessons.push(lesson)
                })
                section.lessions=lessons;
                sections.push(section)
            })
            const courseData : CourseDetailResponseData={
                id: course.id,
                slug: course.slug,
                title: course.title,
                categories: categories,
                summary: course.summary,
                author: course.user,
                ratings: 5,
                thumbnail: course.thumbnail,
                description: course.description,
                sections: sections,
                created_at: course.created_at,
                updated_at: course.updated_at,
            }
                return new ResponseSuccess(200,'Get course detail successfully', true, courseData)
        }
        return new ResponseError(400,'Bad request 2',false)
 
    } catch (error) {
        console.log(error)
        return new ResponseError(400,'Bad request 3',false)
    }

}


const CourseService = {
    getCourseDetail,
};

export default CourseService;

