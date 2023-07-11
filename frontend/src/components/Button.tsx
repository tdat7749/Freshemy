import React,{FC} from 'react'


type ButtonProps = {
    full:boolean | null,
    bgColor:string,
    color:string
    title:string,
    size: "sm" | "lg",
}

const Button:FC<ButtonProps> = ({full,bgColor,title,size,color}:ButtonProps) =>{
    return (
        <button className={`${size === "sm" ? "h-[30px] py-[12px] font-normal" : "h-[68px] py-[8px] font-medium"} ${full === true ? "w-full" : ""} hover:opacity-80 bg-${bgColor} text-${color}`}>{title}</button>
    )
}

export default Button