import { RequestHasLogin } from "../types/request";
import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken";
import { db } from "../configs/db.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import configs from "../configs";

export const isLogin = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const jsonWebToken = authHeader?.split(" ")[1];

        if (!jsonWebToken) {
            res.status(401).json({ message: "Unauthorized" });
        } else {
            const decodeJsonWebToken = jwt.verify(jsonWebToken, configs.general.JWT_SECRET_KEY) as MyJwtPayload;
            if (decodeJsonWebToken) {
                const isFoundUser = await db.user.findUnique({
                    where: {
                        id: decodeJsonWebToken.user_id,
                    },
                });

                if (isFoundUser) {
                    req.user_id = isFoundUser.id;
                }
            }
            next();
        }
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return res.status(401).json({ message: error.toString() });
        }
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof NotBeforeError) {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server" });
    }
};
