import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response"
import { RequestHasLogin } from "../types/request"
import { db } from '../configs/db.config'
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import configs from "../configs";
import {
    MESSAGE_ERROR_PASSWORD_NEW_DIFFERENT_FROM_CONFIRM,
    MESSAGE_SUCCESS_CHANGE_PASSWORD,
    MESSAGE_ERROR_PASSWORD_WRONG,
    MESSAGE_ERROR_USER_NOT_FOUND,
    MESSAGE_ERROR_BAD_REQUEST,
    MESSAGE_ERROR_INTERNAL_SERVER,
} from "../utils/constant"


const changePassword = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { current_password, new_password, confirm_password } = req.body

        if (new_password !== confirm_password) {
            return new ResponseError(400, MESSAGE_ERROR_PASSWORD_NEW_DIFFERENT_FROM_CONFIRM, false)
        }

        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true
            }
        })
        if (user) {
            const isCorrectPassword = await bcrypt.compare(current_password, user.password)
            if (isCorrectPassword) {
                const hashedNewPassword = await bcrypt.hash(new_password, configs.general.HASH_SALT) 

                await db.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        password: hashedNewPassword
                    }
                })
                return new ResponseSuccess(200, MESSAGE_SUCCESS_CHANGE_PASSWORD, true)
            }

            return new ResponseError(400, MESSAGE_ERROR_PASSWORD_WRONG, false)
        }

        return new ResponseError(404, MESSAGE_ERROR_USER_NOT_FOUND, false)
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
}


const UserService = {
    changePassword
}

export default UserService