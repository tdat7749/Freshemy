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
    MESSAGE_SUCCESS_RESET_PASSWORD,
    MESSAGE_SUCCESS_VERIFCATION_FORGOT_PASSWORD,
    MESSSAGE_ERROR_VALIDATION_FAIL,
    MESSAGE_ERROR_LOGIN_FAILED,
    MESSAGE_SUCCESS_LOGIN,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_SEND_EMAIL,
    MESSAGE_ERROR_LOGIN_UNVERIFIED,
    MESSAGE_ERROR_UNAUTHORIZED,
    MESSAGE_ERROR_EMAIL_INCORRECT,
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
            return new ResponseError(404, MESSAGE_ERROR_EMAIL_INCORRECT, false);
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
                token: token
            },
        });
        const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
        const html = `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                .image_block img+div {
                    display: none;
                }
        
                @media (max-width:700px) {
                    .desktop_hide table.icons-inner {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .image_block img.fullWidth {
                        max-width: 100% !important;
                    }
        
                    .row-content {
                        width: 100% !important;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        max-width: 0;
                        min-height: 0;
                        max-height: 0;
                        font-size: 0;
                        display: none;
                        overflow: hidden;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        max-height: none !important;
                        display: table !important;
                    }
                }
            </style>
        </head>
        
        <body style="text-size-adjust: none; background-color: #fff0e3; margin: 0; padding: 0;">
            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff0e3;">
                <tbody>
                    <tr>
                        <td>
                            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                        
                                                        <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:10px;line-height:10px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="width:100%;">
                                                                        <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7631/round_corner_top.png" style="height: auto; display: block; border: 0; max-width: 680px; width: 100%;" width="680" alt="Top round corners" title="Top round corners"></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #fff; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="15" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7631/password_reset.png" style="height: auto; display: block; border: 0; max-width: 374px; width: 100%;" width="374" alt="Resetting Password" title="Resetting Password"></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-2" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                                                            <table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="text-align:center;width:100%;">
                                                                        <h1 style="margin: 0; color: #101010; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 27px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Forgot Your Password?</strong></h1>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #fff; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="16.666666666666668%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                        <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;">
                                                                        <div style="font-family: sans-serif">
                                                                            <div class style="font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 21.6px; color: #848484; line-height: 1.8;">
                                                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 25.2px;"><span style="font-size:14px;">Here is the instruction to reset your password. Please click the button in the under to reset your password.</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-2" style="height:10px;line-height:10px;font-size:1px;">&#8202;</div>
                                                            <table class="button_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:44px;width:160px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#101" fillcolor="#101"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="${link}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#101;border-radius:4px;width:auto;border-top:1px solid #101;font-weight:undefined;border-right:1px solid #101;border-bottom:1px solid #101;border-left:1px solid #101;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Reset Password</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="spacer_block block-4" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                        <td class="column column-3" width="16.666666666666668%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="empty_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 680px; margin: 0 auto;" width="680">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="16.666666666666668%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                        <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                        <td class="column column-3" width="16.666666666666668%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <div class="spacer_block block-1" style="height:0px;line-height:0px;font-size:1px;">&#8202;</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        </html>`
        const mailOptions: SendMail = {
            from: "Freshemy",
            to: `${email}`,
            subject: "Freshdemy - Link verification for reseting password",
            text: "You received message from " + email,
            html: html,
        };

        const isSendEmailSuccess = sendMail(mailOptions);

        if (isSendEmailSuccess) {
            return new ResponseSuccess(200, MESSAGE_SUCCESS_VERIFCATION_FORGOT_PASSWORD, true);
        } else {
            return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
        }
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
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
                token: true
            }
        });
        if(isFoundUser?.token !== token){
            return new ResponseError(404,MESSAGE_ERROR_UNAUTHORIZED, false);
        }
        const updateUser = await configs.db.user.update({
            where: {
                id: id,
            },
            data: {
                password: hash,
                token: null
            },
        });
        if (updateUser) return new ResponseSuccess(200, MESSAGE_SUCCESS_RESET_PASSWORD, true);
        return new ResponseError(400, MESSSAGE_ERROR_VALIDATION_FAIL, false);
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
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
