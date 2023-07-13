import { Request, Response } from 'express'
import { loginSchema } from 'src/validations/auth'
import service from '../services'


class AuthController {
    async login(req: Request, res: Response) {
        const { error: errorValidate } = loginSchema.validate(req.body)

        if (errorValidate) {
            //Return lỗi
        }

        const response = await service.AuthService.login(req)

        //return res.status().json(isResponse)
    }

    async refreshToken(req: Request, res: Response) { //return type Promise<Response>
        const response = await service.AuthService.refreshToken(req)
        //return res.status().json(response)
    }
}


