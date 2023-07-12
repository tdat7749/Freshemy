import { Request } from "express";
import { db } from "../configs/db.config";
import * as bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { RequestHasLogin } from "../types/request";

const login = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password } = req.body;

        const isFoundUser = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isFoundUser) {
            if (!isFoundUser.is_verify) {
                return new ResponseError(401, "Unverified account", false);
            }
            const isVerifyPassword = bcrypt.compare(password, isFoundUser.password);
            if (!isVerifyPassword) {
                return new ResponseError(400, "Email or password is invalid", false);
            }

            const accessToken = jwt.sign(
                {
                    user_id: isFoundUser.id,
                },
                "PrivateKey",
                {
                    expiresIn: "1h",
                },
            );

            const refreshToken = jwt.sign(
                {
                    user_id: isFoundUser.id,
                },
                "PrivateKey",
                {
                    expiresIn: "30d",
                },
            );

            return new ResponseSuccess(200, "Logged in successfully", true, { accessToken, refreshToken });
        }

        return new ResponseError(400, "Email or password is invalid", false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, "Bad request", false);
        }
        return new ResponseError(500, "Internal Server", false);
    }
};

const refreshToken = async (res: Request): Promise<ResponseBase> => {
    try {
        const rfToken = res.cookies.rfToken;

        if (!rfToken) {
            return new ResponseError(400, "Bad request", false);
        }

        const isVerifyRefreshToken = jwt.verify(rfToken, "PrivateKey") as MyJwtPayload;

        const newAccessToken = jwt.sign(
            {
                user_id: isVerifyRefreshToken?.user_id,
            },
            "PrivateKey",
            {
                expiresIn: "1h",
            },
        );

        return new ResponseSuccess(200, "Request successful", true, { accessToken: newAccessToken });
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, "Internal Server", false);
    }
};

const getMe = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const userId = req.user_id;

        const isFoundUser = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (isFoundUser) {
            const userInformation = {
                user_id: isFoundUser.id,
                email: isFoundUser.email,
                first_name: isFoundUser.first_name,
                last_name: isFoundUser.last_name,
            };
            return new ResponseSuccess(200, "Request successful", true, userInformation);
        }

        return new ResponseError(401, "Unauthorized", false);
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, "Internal Server", false);
    }
};

const AuthService = {
    login,
    refreshToken,
    getMe,
};

export default AuthService;
