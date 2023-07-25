import { ValidationError, ValidationErrorItem } from "joi";
import { SendMail } from '../types/sendmail'
import { transporter } from '../configs/nodemailer.config'

export const convertJoiErrorToString = (error: ValidationError): string => {
    return error.details.map((item: ValidationErrorItem) => item.message).join(", ");
};


export const sendMail = (mailOptions: SendMail) => {
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            return false;
        }
    });
    return true;
}

export const resolutions = ["640x360", "1280x720"]