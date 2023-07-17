import { Router } from "express";
import { upload } from "../configs/cloudinary.config";
import { isLogin } from "../middlewares/isLogin";
import controllers from '../controllers/index'
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";

const courseRouter: Router = Router()

courseRouter.post("/", isLogin, upload.single("thumbnail"), controllers.courseController.createCourse)

courseRouter.post("/test", upload.single("thumbnail"), async (req: Request, res: Response) => {
    const thumbnail = req.file
    console.log("Abc")
    if (thumbnail) {
        await cloudinary.uploader.upload(thumbnail.path, (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
                return res.json({ status: 500, message: error.message, success: false })
            }

            return res.json(result)
        }).catch((error) => console.log(error))
    }
})

export default courseRouter