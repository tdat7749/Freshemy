import { Request, Response } from "express";
import { loginSchema, registrationSchema } from "../validations/auth";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { RequestForgotPassword, RequestHasLogin, RequestResetPassword } from "../types/request";
import jwt from "jsonwebtoken";
import service from "../services/index";

class AuthController {
    constructor() {
        this.generateToken = this.generateToken.bind(this);
        this.generateTokenHandler = this.generateTokenHandler.bind(this);
        this.register = this.register.bind(this);
    }

    generateToken(first_name: string, last_name: string, password: string, email: string): string {
        // Generate and return the encoded token based on the user data
        const payload = { first_name, last_name, password, email };
        const secretKey =
            "b286e0f96f6759ec8fb9906b235f4c13dfb23c0505574fd6b82abad035f007fa5dac96ac9038beea3abb9bad20a40bd5a7e891e7502539c04dea853e79d10a9f";
        const expiresIn = "1h"; // Set the expiration time for the token

        const token = jwt.sign(payload, secretKey, { expiresIn });

        return token;
    }

    async generateTokenHandler(req: Request, res: Response): Promise<Response> {
        const { first_name, last_name, password, email } = req.body;

        // Generate a token using the instance method
        const token = this.generateToken(first_name, last_name, password, email);

        // Return the token and other user data in the response
        return res.status(200).json({ token, first_name, last_name, password, email });
    }

    async register(req: Request, res: Response): Promise<Response> {
        const { email, password, first_name, last_name, confirmPassword, ...registrationData } = req.body;

        const data = {
            email,
            password,
            first_name,
            last_name,
            confirmPassword,
            ...registrationData,
        };

        const errorValidate: ValidationError | undefined = registrationSchema.validate(data).error;

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

    async login(req: Request, res: Response): Promise<Response> {
        console.log(req.body.email);
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

        console.log(response);
        return res.status(response.getStatusCode()).json(response);
    }

    async forgotPassword(req: RequestForgotPassword, res: Response): Promise<Response> {
        const response = await service.AuthService.forgotPassword(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async resetPassword(req: RequestResetPassword, res: Response): Promise<Response> {
        const response = await service.AuthService.resetPassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
}

export default AuthController;
