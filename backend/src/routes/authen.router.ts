import {Router,Request,Response} from 'express'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { log } from 'console'
const saltRounds = 10 // recommend by bcrypt
const authenRouter = Router()
const prisma = new PrismaClient()

interface requestBody{
    current_password : string,
    new_password : string, 
    confirm_password : string, 
    id : number
}
authenRouter.patch("/change-password",async (req:Request, res:Response)=>{
    try {
        //lấy token, kiểm tra token, sai thì trả về 401
        //kiểm tra body
        const requestBodyDetail : requestBody = req.body
        if(!requestBodyDetail.current_password || !requestBodyDetail.new_password || !requestBodyDetail.confirm_password || !requestBodyDetail.id)
        {
            return res.status(400).send({ success:'false', message:'Validation failed', data: requestBodyDetail })
        } else {
            const userId = requestBodyDetail.id
            const new_password = requestBodyDetail.new_password
            const current_password = requestBodyDetail.current_password
            console.log(requestBodyDetail)
            // nếu current_password khác với password trong database thì lỗi
            //else đổi pass dựa vào id               
            const findUser = await prisma.user.findFirst({
                where:{
                    id: userId
                }
            })
            if(findUser){
                console.log(findUser.id)
                console.log(`pass trong database: ${findUser.password}`)
                console.log(current_password)
                const isCorrectPassword = await bcrypt.compare(current_password,findUser.password)
                console.log(isCorrectPassword)
                if(isCorrectPassword){
                    const hashedNewPassword = await bcrypt.hash(new_password,saltRounds)
                    const changePassword = await prisma.user.update({
                        where:{
                        id: findUser.id
                        },
                        data:{ 
                        password: hashedNewPassword// ở đây sẽ có hash
                        }
                    })
                    return res.status(200).send({success:'true', message:'Change password successfully'})
                } else {
                    return res.status(500).send({
                        success:'false',
                        message:'Server is down',
                        status:'500'
                    })                      
                }                                      
                }
            else{
                res.status(401).send({
                    success:'false',
                    message:'Wrong old password',
                    status:'401'
                })
            }
                                              
            }             
    } catch (error) {
        return res.status(500).send({success:'false', message:'Server is down'})
    }
})



export default authenRouter

