import { Request } from "express";

export interface RequestHasLogin extends Request {
    user_id?: number;
}

export interface RequestForgotPassword extends Request {
    email?: string;
}

export interface RequestResetPassword extends Request {
    newPassword?: string;
}

