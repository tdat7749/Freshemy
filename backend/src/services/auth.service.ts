import { Request } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { RequestHasLogin } from "../types/request";
import { sendMail } from "../commons";
import configs from "../configs";
import { db } from "../configs/db.config";
import { SendMail } from "../types/sendmail";
import {
    MESSAGE_ERROR_LOGIN_FAILED,
    MESSAGE_ERROR_SEND_EMAIL,
    MESSAGE_ERROR_LOGIN_UNVERIFIED,
    MESSAGE_SUCCESS_LOGIN,
    MESSAGE_ERROR_INTERNAL_SERVER,
} from "../utils/constant";

const register = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password, first_name, last_name } = req.body;

        const isUserFoundByEmail = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isUserFoundByEmail) {
            return new ResponseError(400, "Email already exists", false);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, configs.general.HASH_SALT);

        // Create a new user in the database
        const newUser = await db.user.create({
            //@ts-ignore
            data: {
                email,
                password: hashedPassword,
                first_name,
                last_name,
            },
        });

        if (newUser) {
            const payload = {
                email: newUser.email,
                id: newUser.id,
            };

            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });

            const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
            const mailOptions: SendMail = {
                from: "Freshemy",
                to: `${newUser.email}`,
                subject: "Freshdemy - Verification email",
                text: "You recieved message from " + newUser.email,
                html: `
                    <p>Hi ${newUser.email}</p>, </br>
                    <p>Thanks for getting started with our [Freshemy]!</p></br>
                    
                    <p>We need a little more information to complete your registration, including a confirmation of your email address.</p> </br>
                    
                    <p>Click below to confirm your email address: </p> </br>
                    
                    ${link} </br>
                    
                    <p>If you have problems, please paste the above URL into your web browser.</p>`,
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                return new ResponseSuccess(200, "Signup successful, please check your email", true);
            }
            return new ResponseError(
                400,
                "Email sending failed, please login to the account you just registered to be sent confirmation email again",
                false,
            );
        }
        return new ResponseError(400, "Signup failed", false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, "Internal Server", false);
    }
};

const verifyEmailWhenSignUp = async (req: Request): Promise<ResponseBase> => {
    try {
        const { token } = req.params;

        const isVerifyToken = jwt.verify(token, configs.general.JWT_SECRET_KEY) as MyJwtPayload;

        if (isVerifyToken) {
            const isUserFound = await db.user.findUnique({
                where: {
                    email: isVerifyToken.email,
                },
            });

            if (isUserFound?.is_verify === true) {
                return new ResponseSuccess(200, "This account has been verified before", true);
            }
            const isVerifyUser = await db.user.update({
                where: {
                    email: isUserFound?.email,
                },
                data: {
                    is_verify: true,
                },
            });

            if (isVerifyUser) {
                return new ResponseSuccess(200, "Account verification successful", true);
            }
        }
        return new ResponseError(400, "Verify email failed", true);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, "The verification code has expired, please login so we can resend it", false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, "The verification code is not correct", false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, "This verification code was never generated", false);
        }

        return new ResponseError(500, "Internal Server", false);
    }
};

const login = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password } = req.body;

        const isFoundUser = await configs.db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!isFoundUser) return new ResponseError(400, MESSAGE_ERROR_LOGIN_FAILED, false);

        const isVerifyPassword = await bcrypt.compare(password, isFoundUser.password);
        if (isVerifyPassword) {
            if (!isFoundUser.is_verify) {
                const payload = {
                    email: isFoundUser.email,
                    user_id: isFoundUser.id,
                };

                const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                });

                const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;

                const mailOptions: SendMail = {
                    from: "Freshemy",
                    to: `${isFoundUser.email}`,
                    subject: "Freshdemy - Verification email",
                    text: "You recieved message from " + isFoundUser.email,
                    html: `
                    <p>Hi ${isFoundUser.email}</p>, </br>
                    <p>Thanks for getting started with our [Freshemy]!</p></br>
                    
                    <p>We need a little more information to complete your registration, including a confirmation of your email address.</p> </br>
                    
                    <p>Click below to confirm your email address: </p> </br>
                    
                    ${link} </br>
                    
                    <p>If you have problems, please paste the above URL into your web browser.</p>`,
                };

                const isSendEmailSuccess = sendMail(mailOptions);
                if (!isSendEmailSuccess) {
                    return new ResponseError(400, MESSAGE_ERROR_SEND_EMAIL, false);
                }
                return new ResponseError(400, MESSAGE_ERROR_LOGIN_UNVERIFIED, false);
            }
            const accessToken = jwt.sign(
                {
                    user_id: isFoundUser.id,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                },
            );

            const refreshToken = jwt.sign(
                {
                    user_id: isFoundUser.id,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_REFRESH_EXPIRED_TIME,
                },
            );
            return new ResponseSuccess(200, MESSAGE_SUCCESS_LOGIN, true, { accessToken, refreshToken });
        } else {
            return new ResponseError(400, MESSAGE_ERROR_LOGIN_FAILED, false);
        }
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const refreshToken = async (res: Request): Promise<ResponseBase> => {
    try {
        const rfTokenRaw = res.headers.rftoken as string;
        const rfToken = rfTokenRaw.split("=")[1];

        if (!rfToken) {
            return new ResponseError(400, "Bad request", false);
        }

        const isVerifyRefreshToken = jwt.verify(rfToken, configs.general.JWT_SECRET_KEY) as MyJwtPayload;

        const newAccessToken = jwt.sign(
            {
                user_id: isVerifyRefreshToken?.user_id,
            },
            configs.general.JWT_SECRET_KEY,
            {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            },
        );

        return new ResponseSuccess(200, "Request successful", true, { accessToken: newAccessToken });
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, error.message, false);
        }

        return new ResponseError(500, "Internal Server", false);
    }
};

const getMe = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const userId = req.user_id;

        const isFoundUser = await configs.db.user.findUnique({
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
        return new ResponseError(500, "Internal Server", false);
    }
};

const forgotPassword = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email } = req.body;

        const isFoundUser = await configs.db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isFoundUser === null) {
            return new ResponseError(404, "Email does not exist", false);
        }

        const payload = {
            email: isFoundUser.email,
            id: isFoundUser.id,
        };

        const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
            expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
        });

        const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;

        const mailOptions: SendMail = {
            from: "Freshemy",
            to: `${email}`,
            subject: "Freshdemy - Link verification for reseting password",
            text: "You recieved message from " + email,
            html: "<p>This is your link verification for your account to reset password:</b></br>" + link,
        };

        const isSendEmailSuccess = sendMail(mailOptions);

        if (isSendEmailSuccess) {
            return new ResponseSuccess(200, "Sent a verification code to your email", true);
        } else {
            return new ResponseError(500, "Internal Server", false);
        }
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

const resetPassword = async (req: Request): Promise<ResponseBase> => {
    try {
        const { password, confirmPassword, token } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const decoded = jwt.verify(token, configs.general.JWT_SECRET_KEY!);
        var id = (<any>decoded).id;
        const hash = bcrypt.hashSync(password, salt);
        const updateUser = await configs.db.user.update({
            where: {
                id: id,
            },
            data: {
                password: hash,
            },
        });
        if (updateUser) return new ResponseSuccess(200, "Request successfully", true);
        return new ResponseError(400, "Validation fail", false);
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
    forgotPassword,
    resetPassword,
    register,
    verifyEmailWhenSignUp,
};

export default AuthService;
