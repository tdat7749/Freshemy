import { Request, Response } from "express";
import { loginSchema } from "../validations/auth";
import service from "../services";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { RequestHasLogin } from "../types/request";

class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = loginSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json(convertJoiErrorToString(errorValidate));
        }

        const response = await service.AuthService.login(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async refreshToken(req: Request, res: Response): Promise<Response> {
        const response = await service.AuthService.refreshToken(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async getMe(req: RequestHasLogin, res: Response): Promise<Response> {
        const response = await service.AuthService.refreshToken(req);

        return res.status(response.getStatusCode()).json(response);
    }
}

export default AuthController;
