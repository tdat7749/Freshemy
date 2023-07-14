import { Response } from "express";
import { RequestHasLogin } from "src/types/request";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import {changePasswordSchema} from '../validations/user'
import service from "../services";

class UserController{
    async changePassword(req:RequestHasLogin,res:Response){
        const errorValidate: ValidationError | undefined = changePasswordSchema.validate(req.body).error;

        if (errorValidate) {
            return res
                .status(400)
                .json({ status_code: 400, message: convertJoiErrorToString(errorValidate), success: false });
        }

        const response = await service.UserService.changePassword(req)

        return res.status(response.getStatusCode()).json(response)
    }
}

export default UserController;