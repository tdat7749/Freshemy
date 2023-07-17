import nodemailer from 'nodemailer'
import configs from '.';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: configs.general.EMAIL_SERVER,
        pass: configs.general.PASSWORD_SERVER,
    },
});