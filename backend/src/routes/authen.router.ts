import {Router,Request,Response} from 'express'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { log } from 'console'
const saltRounds = 10 //
const authenRouter = Router()
const prisma = new PrismaClient()

interface requestBody{
    current_password : string,
    new_password : string, 
    confirm_password : string, 
    token : string
}
authenRouter.patch("/change-password",async (req:Request, res:Response)=>{
    try {
        //lấy token, kiểm tra token, sai thì trả về 401
        //kiểm tra body
        const requestBodyDetail : requestBody = req.body
        if(!requestBodyDetail.current_password || !requestBodyDetail.new_password || !requestBodyDetail.confirm_password || !requestBodyDetail.token)
        {
            return res.status(400).send({ success:'false', message:'Validation failed', data: requestBodyDetail })
        } else {
            const token = requestBodyDetail.token
            const new_password = requestBodyDetail.new_password
            const current_password = requestBodyDetail.current_password
            console.log(requestBodyDetail)
            const compareToken = await prisma.user.findFirst({
                where:{
                    token: token
                }
            })
            if(!compareToken){
                return res.status(401).send({
                    success:'false',
                    message:'Unauthorized',
                    status:'401'
                })
            } else { 
            //tìm id, password dựa trên token
            // nếu current_password khác với password trong database thì lỗi
            //else đổi pass dựa vào id               
                const findUser = await prisma.user.findFirst({
                    where:{
                        token: token
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
                        console.log()
                        return res.status(200).send({success:'true', message:'Change password successfully'})
                    } else {
                        console.log(`current password: ${current_password} hash currrent password: ${await bcrypt.hash(current_password,saltRounds)}`)
                        return res.status(500).send({
                            success:'false',
                            message:'Server is down 1000',
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
            }             
    } catch (error) {
        return res.status(500).send({success:'false', message:'Server is down'})
    }
})



export default authenRouter

//const createUser = await prisma.user.create({data:{
    //     first_name:'nhan',
    //     last_name:'nguyen',
    //     email:'nhan@gmail.com',
    //     password:'password',
    //     description:'description',
    //     url_avatar:'https://ih1.redbubble.net/image.4263848421.1067/st,small,507x507-pad,600x600,f8f8f8.jpg',
    //     token:'token'
    // }})
    //$10$q47l99vfe74cpBcUdJAJIeI5KXu1J4YuprG0zhk7u4OOGSIJfm0me