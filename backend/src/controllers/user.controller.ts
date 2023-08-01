import { Response } from "express";
import { RequestHasLogin } from "../types/request";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { ChangeUserInformation, changePasswordSchema } from "../validations/user";
import service from "../services";
import { Request } from "express"
class UserController {
    async changePassword(req: RequestHasLogin, res: Response) {
        const errorValidate: ValidationError | undefined = changePasswordSchema.validate(req.body).error;

        if (errorValidate) {
            return res
                .status(400)
                .json({ status_code: 400, message: convertJoiErrorToString(errorValidate), success: false });
        }

        const response = await service.UserService.changePassword(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async getInformation(req: RequestHasLogin, res: Response) {

        const response = await service.UserService.getInformation(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async getAuthorInformation(req: Request, res: Response) {

        const response = await service.UserService.getAuthorInformation(req);

        return res.status(response.getStatusCode()).json(response);
    }
    
    async changeUserInformation(req: RequestHasLogin, res: Response) {
        const errorValidate: ValidationError | undefined = ChangeUserInformation.validate(req.body).error;

        if (errorValidate) {
            return res
                .status(400)
                .json({ status_code: 400, message: convertJoiErrorToString(errorValidate), success: false });
        }

        const response = await service.UserService.changeUserInformation(req);

        return res.status(response.getStatusCode()).json(response);
    }
}

export default UserController;
