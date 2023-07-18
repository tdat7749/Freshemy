// course.service.ts
import { db } from "../configs/db.config";

export const searchMyCourses = async (pageIndex: number, keyword: string, userId: number): Promise<any> => {
    try {
        const parsedPageIndex = parseInt(pageIndex.toString(), 10);
        const parsedKeyword = keyword;

        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;

        const courses = await db.course.findMany({
            skip,
            take,
            where: {
                title: {
                    contains: parsedKeyword,
                },
                user_id: userId, // Lọc theo user_id của Trần Văn C
            },
            include: {
                user: true,
                courses_categories: {
                    include: {
                        category: true,
                    },
                },
                ratings: {
                    include: {
                        user: true,
                    },
                },
                sections: true,
            },
        });

        const totalRecord = await db.course.count({
            where: {
                title: {
                    contains: parsedKeyword,
                },
                user_id: userId, // Lọc theo user_id của Trần Văn C
            },
        });

        const totalPage = Math.ceil(totalRecord / take);

        const myCoursesData = courses.map((course) => {
            const ratingsSum = course.ratings.reduce((total, rating) => total + rating.value, 0);
            const averageRating = course.ratings.length > 0 ? ratingsSum / course.ratings.length : 0;

            return {
                id: course.id,
                title: course.title,
                summary: course.summary,
                rate: averageRating,
                author: `${course.user?.first_name} ${course.user?.last_name}`,
                category: course.courses_categories.map((cc) => cc.category.title),
                number_section: course.sections.length,
                slug: course.slug,
            };
        });

        return {
            success: true,
            message: "Get data successfully",
            status_code: 200,
            data: {
                total_page: totalPage,
                total_record: totalRecord,
                courses: myCoursesData,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Internal Server Error",
            status_code: 500,
        };
    }
};

export const deleteMyCourse = async (courseId: number): Promise<any> => {
    try {
        await db.course.delete({
            where: {
                id: courseId,
            },
        });

        return {
            success: true,
            message: "Delete successfully",
            status_code: 200,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Internal Server Error",
            status_code: 500,
        };
    }
};

const CourseService = {
    searchMyCourses,
    deleteMyCourse,
};

export default CourseService;
