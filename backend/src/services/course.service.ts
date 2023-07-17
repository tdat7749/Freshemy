import { Course, PrismaClient } from '@prisma/client';
import { CreateCourseDTO } from '../DTOS/course.dto';
import FileUploader from '../middlewares/FileUpload';

const prisma = new PrismaClient();

export class CourseService {
    public async createCourse(createCourseDTO: CreateCourseDTO, userId: number, thumbnail: Express.Multer.File): Promise<Course | null> {
        try {
            const { title, slug, status, description, summary, categories } = createCourseDTO;

            // Process and save the thumbnail file
            const uploader = new FileUploader();
            const thumbnailFileName = await uploader.uploadImage(thumbnail, 'course-thumbnails');

            const course = await prisma.course.create({
                data: {
                    title,
                    slug,
                    status,
                    description,
                    summary,
                    user_id: userId,
                    thumbnail: thumbnailFileName,
                },
            });

            if (course) {
                // Create associations with categories
                await prisma.courseCategory.createMany({
                    data: categories.map((categoryId: number) => ({ course_id: course.id, category_id: categoryId })),
                });
            }

            return course;
        } catch (error: any) {
            console.error('Error creating course:', error);
            // Perform additional error handling actions if needed
            return null;
        }
    }
}
