import { Response } from "express";
import services from "../services";
import { RequestHasLogin } from "../types/request.type";

class FileStorageController {
    async uploadImageToCloudinary(req: RequestHasLogin, res: Response): Promise<Response> {
        const response = await services.FileStorageService.uploadImageToCloudinary(req);
        return res.status(response.getStatusCode()).json(response);
    }
}

export default FileStorageController;
