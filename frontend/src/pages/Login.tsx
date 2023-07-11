import React,{FC} from 'react'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

type Props = {
    isLogin: boolean;
  };

const Login:FC<Props> = ({isLogin}:Props) =>{
    return (
        <>
        <Header isLogin={isLogin}/>
           <div className='px-[16px] tablet:px-[60px] flex items-center justify-center tablet:justify-center tablet:space-x-[120px] h-[calc(100vh-100px)]'>
                <div className='w-[360px] tablet:max-w-[505px] rounded-[12px] bg-bgForm mx-auto tablet:mx-0 flex-1'>
                        <div className='w-full p-[16px]'>
                            <h1 className='text-[32px] tablet:text-[40px] font-bold text-center text-text'>LOGIN TO FRESHEMY</h1>
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
                                <div className='py-[12px]'>
                                    <Button size='lg' color='white' bgColor='error' title='Login' full={true}></Button>
                                </div>
                                <div className='text-center space-y-[8px]'>
                                    <p className='text-text font-normal text-[20px] tablet:text-[22px]'>Don't have an account? <span className='underline'><Link to={"/register"}>Signup</Link></span></p>
                                    <p className='text-text font-normal text-[20px] tablet:text-[22px]'><Link to={"/forgot-password"}>Forgot Password?</Link></p>
                                </div>
                            </div>
                        </div>
                </div>
                <div className='hidden tablet:block w-[400px] bg-red-100 h-[10px]'>
                    <h1>Hêlo</h1>
                </div>
           </div>
        </>
    )
}

export default Login