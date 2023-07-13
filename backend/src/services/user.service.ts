import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response"
import { RequestHasLogin } from "../types/request"
import {db} from '../configs/db.config'
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


const changePassword = async (req:RequestHasLogin):Promise<ResponseBase> =>{
    try {
        const {current_password,new_password,confirm_password} = req.body

        if(new_password !== confirm_password){
            return new ResponseError(400,"New password and comfirm password must be same",false)
        }

        const findUser = await db.user.findFirst({
            where:{
                id: req.user_id,
                is_verify: true
            }
        })
        if(findUser){
            const isCorrectPassword = await bcrypt.compare(current_password,findUser.password)
            if(isCorrectPassword){
                const hashedNewPassword = await bcrypt.hash(new_password,10) //.env
                
                await db.user.update({
                    where:{
                        id: findUser.id
                    },
                    data:{ 
                        password: hashedNewPassword
                    }
                })
                return new ResponseSuccess(200,"Change password successfully",true)
            }
            
            return new ResponseError(400,"Wrong password",false)
        }

        return new ResponseError(404,"User is not found",false)
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, "Bad request", false);
        }
        return new ResponseError(500, "Internal Server", false);
    }
}


const UserService = {
    changePassword
}

export default UserService