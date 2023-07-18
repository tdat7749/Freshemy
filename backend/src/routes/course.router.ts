import express from "express";
import CourseController from "../controllers/course.controller";

import { isLogin } from "../middlewares/isLogin";
import { RequestMyCourseWithUser } from "../types/request";

import { Request, Response, NextFunction } from "express";

const router = express.Router();
const courseController = new CourseController();

router.use(isLogin);

router.get("/search-my-courses", (req, res) => courseController.searchMyCourses(req, res));

router.delete("/delete-my-course/:id", isLogin, courseController.deleteMyCourse.bind(courseController));

export default router;
