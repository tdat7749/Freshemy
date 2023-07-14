/* eslint-disable prettier/prettier */
import dotenv from "dotenv";
dotenv.config();

export const general = {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    PORT: parseInt(process.env.PORT || "3001"),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    PASSWORD_SERVER: process.env.PASSWORD_SERVER,
};
