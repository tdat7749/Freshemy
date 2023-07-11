import { Request } from 'express'
import { db } from '../configs/db.config'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MyJwtPayload } from 'src/types/decodeToken'

const login = async (req: Request) => {
    const { email, password } = req.body

    const isFoundUser = await db.user.findUnique({
        where: {
            email: email
        }
    })

    if (isFoundUser) {
        const isVerifyPassword = bcrypt.compare(password, isFoundUser.password)
        if (!isVerifyPassword) {
            // return về lỗi "Tài khoản hoặc mật khẩu không chính xác"
        }

        const accessToken = jwt.sign(
            {
                user_id: isFoundUser.id
            },
            "PrivateKey",
            {
                expiresIn: "1h"
            }
        )

        const refreshToken = jwt.sign(
            {
                user_id: isFoundUser.id
            },
            "PrivateKey",
            {
                expiresIn: "10d"
            }
        )

        // return accessToken + refeshToken + statusCode + ..... về    
    }

    // return lỗi không tìm được tài khoản
}


const refreshToken = async (res: Request) => {
    const { rfToken } = res.cookies

    const isVerifyRefreshToken = jwt.verify(rfToken, "PrivateKey") as MyJwtPayload

    if (!isVerifyRefreshToken) {
        // return Token không hợp lệ hoặc đã hết hạn
    }

    const newAccessToken = jwt.sign(
        {
            user_id: isVerifyRefreshToken?.user_id,
        },
        "PrivateKey",
        {
            expiresIn: "1h"
        }
    )

    // return về accessToken cho client

}

const AuthService = {
    login,
    refreshToken
}

export default AuthService