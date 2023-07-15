import { ValidationError, ValidationErrorItem } from "joi";
import { SendMail } from '../types/sendmail'
import { transporter } from '../configs/nodemailer.config'

export const convertJoiErrorToString = (error: ValidationError): string => {
    return error.details.map((item: ValidationErrorItem) => item.message).join(", ");
};


export const sendMail = (mailOptions: SendMail) => {
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
    });
    return true;
}