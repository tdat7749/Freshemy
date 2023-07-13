import { Request } from "express";
import * as bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { RequestHasLogin, RequestForgotPassword, RequestResetPassword } from "../types/request";
import nodemailer from "nodemailer";
import configs from "../configs";

const login = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password } = req.body;

        const isFoundUser = await configs.db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isFoundUser) {
            if (!isFoundUser.is_verify) {
                return new ResponseError(401, "Unverified account", false);
            }
            const isVerifyPassword = await bcrypt.compare(password, isFoundUser.password);
            if (isVerifyPassword) {
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
            } else {
                return new ResponseError(400, "Email or password is invalid", false);
            }
        } else {
            return new ResponseError(400, "Email or password is invalid", false);
        }
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

const sendEmail = (email: string, link: string): boolean => {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: configs.general.EMAIL_SERVER,
            pass: configs.general.PASSWORD_SERVER,
        },
    });
    var mainOptions = {
        from: "Freshemy",
        to: `${email}`,
        subject: "Link verification for reseting password",
        text: "You recieved message from " + email,
        html: "<p>This is your link verification for your account to reset password:</b></br>" + link,
    };

    transporter.sendMail(mainOptions, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
    });
    return true;
};

const forgotPassword = async (req: RequestForgotPassword): Promise<ResponseBase> => {
    try {
        const { email } = req.body;

        let user = await configs.db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user === null) {
            return new ResponseError(404, "Invalid email", false);
        }

        const payload = {
            email: user.email,
            id: user.id,
        };

        const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, { expiresIn: "15m" });
        const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
        const isSendEmailSuccess = sendEmail(user.email, link);
        if (isSendEmailSuccess) {
            return new ResponseSuccess(200, "Request Succesfully", true);
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

const resetPassword = async (req: RequestResetPassword): Promise<ResponseBase> => {
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
};

export default AuthService;
