import React,{FC} from 'react'
import Button from '../components/Button'

const Login:FC = () =>{
    return (
        <>
            <div className='w-[360px] rounded-[12px] flex items-center justify-center bg-background mx-auto h-auto'>
                <div className='w-full p-[16px]'>
                    <h1 className='text-[32px] font-bold text-center text-text'>LOGIN TO FRESHEMY</h1>
                    <div className=''>
                        <div className=''>
                            <label htmlFor='email' className='text-[24px] text-text'>Email</label>
                            <input type="email" name='email' className='w-full h-[68px] rounded-[8px] px-[8px] border-[1px] border-error outline-none'/>
                            <span className='text-[14px] text-error font-medium'>Lỗi rồi nè bạn</span>
                        </div>
                        <div className=''>
                            <label htmlFor='password' className='text-[24px] text-text'>Password</label>
                            <input type="password" name='password' className='w-full h-[68px] rounded-[8px] px-[8px] border-[1px] border-error outline-none'/>
                            <span className='text-[14px] text-error font-medium'>Lỗi rồi nè bạn</span>
                        </div>
                        <div className='pt-[12px]'>
                            <Button size='lg' color='white' bgColor='switch' title='Login' full={true}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login