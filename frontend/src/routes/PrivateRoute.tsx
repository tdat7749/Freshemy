import React from "react"
import { Navigate, Outlet } from "react-router-dom"

type PrivateRouteType = {
    isLogin:boolean
}

const PrivateRoute:React.FC<PrivateRouteType> = ({isLogin}) =>{
    return isLogin ? <Outlet/> : <Navigate to={"/"}/>
}


export default PrivateRoute