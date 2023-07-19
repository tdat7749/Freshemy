/* eslint-disable prettier/prettier */
import dotenv from "dotenv";
dotenv.config();

export const general = {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    PORT: parseInt(process.env.PORT || "3001"),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    PASSWORD_SERVER: process.env.PASSWORD_SERVER,
    TOKEN_ACCESS_EXPIRED_TIME: process.env.TOKEN_ACCESS_EXPIRED_TIME,
    TOKEN_REFRESH_EXPIRED_TIME: process.env.TOKEN_REFRESH_EXPIRED_TIME,
    HASH_SALT: parseInt(process.env.HASH_SALT as string),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT as string),
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
