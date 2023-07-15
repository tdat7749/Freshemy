import { Request, Response } from "express";
import { loginSchema, registrationSchema } from "../validations/auth";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { RequestHasLogin } from "../types/request";
import service from "../services/index";

class AuthController {

    async register(req: Request, res: Response): Promise<Response> {

        const errorValidate: ValidationError | undefined = registrationSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }

        const response = await service.AuthService.register(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async verifyEmailWhenSignUp(req: Request, res: Response): Promise<Response> {
        const response = await service.AuthService.verifyEmailWhenSignUp(req)

        return res.status(response.getStatusCode()).json(response)
    }

    async login(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = loginSchema.validate(req.body).error;

        if (errorValidate) {
            return res
                .status(400)
                .json({ status_code: 400, message: convertJoiErrorToString(errorValidate), success: false });
        }

        const response = await service.AuthService.login(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async refreshToken(req: Request, res: Response): Promise<Response> {
        const response = await service.AuthService.refreshToken(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async getMe(req: RequestHasLogin, res: Response): Promise<Response> {
        const response = await service.AuthService.getMe(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async forgotPassword(req: Request, res: Response): Promise<Response> {
        const response = await service.AuthService.forgotPassword(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async resetPassword(req: Request, res: Response): Promise<Response> {
        const response = await service.AuthService.resetPassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
}

export default AuthController;
