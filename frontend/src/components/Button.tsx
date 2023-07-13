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
        <button className={`bg-${bgColor}  hover:opacity-80 text-${color} ${size === "sm" ? "h-[30px] py-[12px] font-normal text-[12px] rounded-[8px]" : "h-[68px] py-[8px] font-medium text-[32px] rounded-[16px]"} ${full === true ? "w-full" : ""}`}>{title}</button>
    )
}

export default Button