import express, { RequestHandler } from 'express';
import { CourseController } from '../controllers/course.controller';
import { isLogin } from '../middlewares/isLogin';
import multer from 'multer';
import { RequestCreateCourseWithUserId } from "../types/request";


const router = express.Router();
const courseController = new CourseController();

// Configure multer storage and file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/course-thumbnails');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage });

router.post('/courses', isLogin, upload.single('thumbnail'), courseController.createCourse as unknown as RequestHandler);


export default router;
