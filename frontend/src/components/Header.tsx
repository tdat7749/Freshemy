import React,{FC} from 'react'


const Header:FC = () =>{
    return(
        <div className='h-[140px] px-[60px] py-[30px] bg-primary w-full mx-auto'>
            <div className='flex justify-between h-[80px] items-center'>
                <h1 className='text-[primary]'>Logo</h1>
                <h1 className='text-[primary]'>Logo</h1>
                <h1 className='text-[primary]'>Logo</h1>
            </div>
        </div>
    )
}

export default Header