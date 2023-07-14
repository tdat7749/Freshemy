import apiCaller from "../api-config/apiCaller";
import {ChangePassword as ChangePasswordType} from '../types/user'


export const changePassword = async(values:ChangePasswordType) =>{
    const path = "/users/change-password"

    const response = await apiCaller("PATCH",path,values)

    return response
}