import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { RequestHasLogin } from "../types/request.type";
import { db } from "../configs/db.config";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import configs from "../configs";

import i18n from "../utils/i18next";

const changePassword = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { current_password, new_password, confirm_password } = req.body;

        if (new_password !== confirm_password) {
            return new ResponseError(400, i18n.t("errorMessages.newPasswordDiiferentOldPassword"), false);
        }

        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
        });
        if (user) {
            const isCorrectPassword = await bcrypt.compare(current_password, user.password);
            if (isCorrectPassword) {
                const hashedNewPassword = await bcrypt.hash(new_password, configs.general.HASH_SALT);

                await db.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        password: hashedNewPassword,
                    },
                });
                return new ResponseSuccess(200, i18n.t("successMessages.changePasswordSuccessfully"), true);
            }

            return new ResponseError(400, i18n.t("errorMessages.wrongPassword"), false);
        }

        return new ResponseError(404, i18n.t("errorMessages.userNotFound"), false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const UserService = {
    changePassword,
};

export default UserService;
