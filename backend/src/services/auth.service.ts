import { Request } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { RequestHasLogin } from "../types/request";
import { sendMail } from "../commons";
import configs from "../configs";
import { db } from "../configs/db.config";
import { SendMail } from "../types/sendmail";


// const generateToken = (userId: number): string => {
//     const secretKey =
//         "73fb7f5b99b27706cc6c2c708f8c8f57aa31a4a0e0712c06f00483ba69a9a5162c55af93437e4b9563930d012d76f9f9ff9108394a77f41af5f78db50537d79b";
//     const expiresIn = "1h";

//     const payload = { userId };
//     const token = jwt.sign(payload, secretKey, { expiresIn });

//     return token;
// };

const register = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password, first_name, last_name } = req.body;

        const isUserFoundByEmail = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if (isUserFoundByEmail) {
            return new ResponseError(400, "Email already exists", false);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, configs.general.HASH_SALT);

        // Create a new user in the database
        const newUser = await db.user.create({
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

            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, { expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME });

            const link = `${configs.general.DOMAIN_NAME}/verifyEmail/${token}`;
            const mailOptions: SendMail = {
                from: "Freshemy",
                to: `${newUser.email}`,
                subject: "Email Verification",
                text: "You recieved message from " + newUser.email,
                html: "<p>Here is the link to verify your email, please click here:</b></br>" + link
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                return new ResponseSuccess(200, "Signup successful, please check your email", true);
            }
            return new ResponseError(400, "Email sending failed, please login to the account you just registered to be sent confirmation email again", false);
        }
        return new ResponseError(400, "Signup failed", false)
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, "Internal Server", false);
    }
};


const verifyEmailWhenSignUp = async (req: Request): Promise<ResponseBase> => {
    try {
        const { token } = req.params

        const isVerifyToken = jwt.verify(token, configs.general.JWT_SECRET_KEY) as MyJwtPayload

        if (isVerifyToken) {
            const isUserFound = await db.user.findUnique({
                where: {
                    email: isVerifyToken.email
                }
            })

            console.log(isUserFound?.is_verify, "Đây đây")

            if (isUserFound?.is_verify === true) {
                return new ResponseSuccess(200, "This account has been verified before", true)
            }
            const isVerifyUser = await db.user.update({
                where: {
                    email: isUserFound?.email
                },
                data: {
                    is_verify: true
                }
            })

            if (isVerifyUser) {
                return new ResponseSuccess(200, "Account verification successful", true)
            }
        }
        return new ResponseError(400, "Verify email failed", true)

    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false)
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, error.message, false);
        }

        return new ResponseError(500, "Internal Server", false)
    }
}

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
                return new ResponseError(400, "Unverified account", false);
            }
            const isVerifyPassword = await bcrypt.compare(password, isFoundUser.password);
            if (isVerifyPassword) {
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
                return new ResponseSuccess(200, "Logged in successfully", true, { accessToken, refreshToken });
            } else {
                return new ResponseError(400, "Email or password is invalid", false);
            }
        } else {
            return new ResponseError(400, "Email or password is invalid", false);
        }
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, "Internal Server", false);
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

// const sendEmail = (email: string, link: string): boolean => {
//     var mainOptions = {
//         from: "Freshemy",
//         to: `${email}`,
//         subject: "Link verification for reseting password",
//         text: "You recieved message from " + email,
//         html: "<p>This is your link verification for your account to reset password:</b></br>" + link,
//     };
// };

const forgotPassword = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email } = req.body;

        const isFoundUser = await configs.db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (isFoundUser === null) {
            return new ResponseError(404, "Invalid email", false);
        }

        const payload = {
            email: isFoundUser.email,
            id: isFoundUser.id,
        };

        const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, { expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME });

        const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;

        const mailOptions: SendMail = {
            from: "Freshemy",
            to: `${email}`,
            subject: "Link verification for reseting password",
            text: "You recieved message from " + email,
            html: "<p>This is your link verification for your account to reset password:</b></br>" + link,
        };

        const isSendEmailSuccess = sendMail(mailOptions);

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
    verifyEmailWhenSignUp
};

export default AuthService;
