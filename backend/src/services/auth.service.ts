import { Request } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken.type";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { RequestHasLogin } from "../types/request.type";
import { sendMail } from "../commons";
import configs from "../configs";
import { db } from "../configs/db.config";
import { SendMail } from "../types/sendmail.type";

import { setResetEmail, setsignUpEmail } from "../configs/nodemailer.config";
import i18n from "../utils/i18next";

const register = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password, first_name, last_name } = req.body;

        const isUserFoundByEmail = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isUserFoundByEmail) {
            return new ResponseError(400, i18n.t("errorMessages.emailAlreadyExists"), false);
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
            const html = setsignUpEmail(link);
            const mailOptions: SendMail = {
                from: "Freshemy",
                to: `${newUser.email}`,
                subject: "Freshdemy - Verification email",
                text: "You recieved message from " + newUser.email,
                html: html,
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                return new ResponseSuccess(200, i18n.t("successMessages.signUpSuccess"), true);
            }
            return new ResponseError(400, i18n.t("errorMessages.errorSendEmail"), false);
        }
        return new ResponseError(400, i18n.t("errorMessages.signUpFailed"), false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
                return new ResponseSuccess(200, i18n.t("successMessages.verifiedEmailBefore"), true);
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
                return new ResponseSuccess(200, i18n.t("successMessages.verifiedEmail"), true);
            }
        }
        return new ResponseError(400, i18n.t("errorMessages.verifiedEmailFailed"), true);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, i18n.t("errorMessages.tokenExpired"), false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, i18n.t("errorMessages.tokenVerfiedCode"), false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, i18n.t("errorMessages.tokenGernerateCode"), false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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

        if (!isFoundUser) return new ResponseError(400, i18n.t("errorMessages.loginFailed"), false);

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
                    return new ResponseError(400, i18n.t("errorMessages.errorSendEmail"), false);
                }

                return new ResponseError(400, i18n.t("errorMessages.loginUnverified"), false);
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
            return new ResponseSuccess(200, i18n.t("successMessages.successLogin"), true, {
                accessToken,
                refreshToken,
            });
        } else {
            return new ResponseError(400, i18n.t("errorMessages.loginFailed"), false);
        }
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const refreshToken = async (res: Request): Promise<ResponseBase> => {
    try {
        const rfTokenRaw = res.headers.rftoken as string;
        const rfToken = rfTokenRaw.split("=")[1];

        if (!rfToken) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
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

        return new ResponseSuccess(200, i18n.t("successMessages.requestSuccess"), true, {
            accessToken: newAccessToken,
        });
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, i18n.t("errorMessages.loginAgain"), false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, i18n.t("errorMessages.loginAgain"), false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, i18n.t("errorMessages.loginAgain"), false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
                url_avatar: isFoundUser.url_avatar,
                description: isFoundUser.description
            };
            return new ResponseSuccess(200, i18n.t("successMessages.requestSuccess"), true, userInformation);
        }

        return new ResponseError(401, i18n.t("errorMessages.UnAuthorized"), false);
    } catch (error: any) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
            return new ResponseError(404, i18n.t("errorMessages.inCorrectEmail"), false);
        }

        const payload = {
            email: isFoundUser.email,
            id: isFoundUser.id,
        };

        const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
            expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
        });

        const updateUser = await configs.db.user.update({
            where: {
                email: email,
            },
            data: {
                token: token,
            },
        });
        const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
        const html = setResetEmail(link);
        const mailOptions: SendMail = {
            from: "Freshemy",
            to: `${email}`,
            subject: "Freshdemy - Link verification for reseting password",
            text: "You received message from " + email,
            html: html,
        };

        const isSendEmailSuccess = sendMail(mailOptions);

        if (isSendEmailSuccess) {
            return new ResponseSuccess(200, i18n.t("successMessages.verificationForgotPassword"), true);
        } else {
            return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
        }
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const resetPassword = async (req: Request): Promise<ResponseBase> => {
    try {
        const { password, confirmPassword, token } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const decoded = jwt.verify(token, configs.general.JWT_SECRET_KEY!);
        var id = (<any>decoded).id;
        const hash = bcrypt.hashSync(password, salt);

        const isFoundUser = await configs.db.user.findUnique({
            where: {
                id: id,
            },
            select: {
                token: true,
            },
        });
        if (isFoundUser?.token !== token) {
            return new ResponseError(404, i18n.t("errorMessages.UnAuthorized"), false);
        }
        const updateUser = await configs.db.user.update({
            where: {
                id: id,
            },
            data: {
                password: hash,
                token: null,
            },
        });
        if (updateUser) return new ResponseSuccess(200, i18n.t("successMessages.resetPasswordSuccess"), true);
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
