import React,{FC, useRef} from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { Formik ,ErrorMessage,Field} from 'formik'
import { Login as LoginType } from '../types/auth'
import * as Yup from 'yup'


type Props = {
    isLogin: boolean;
};

const Login:FC<Props> = ({isLogin}:Props) =>{


    const initialValue:LoginType = {
        email:"",
        password:""
    }
    
    const loginValidationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required")
    })

    const formikRef = useRef(null)

    const handleOnSubmit = (values:LoginType) => {
        
    }


    return (
        <>
        <Header isLogin={isLogin}/>
           <div className='px-[16px] tablet:px-[60px] flex items-center justify-center tablet:justify-center tablet:space-x-[120px] h-[calc(100vh-100px)]'>
                <div className='w-[360px] tablet:max-w-[505px] rounded-[12px] bg-bgForm mx-auto tablet:mx-0 flex-1'>
                        <div className='w-full p-[16px]'>
                            <h1 className='text-[32px] tablet:text-[40px] font-bold text-center text-text'>LOGIN TO FRESHEMY</h1>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={loginValidationSchema}
                                onSubmit={handleOnSubmit}
                                innerRef={formikRef}
                            >
                                {(formik) => (
                                     <form onSubmit={formik.handleSubmit}>
                                     <div className=''>
                                         <label htmlFor='email' className='text-[24px] text-text'>Email</label>
                                         <Field type="text" name='email' className='w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none'/>
                                         <ErrorMessage
                                             name="email"
                                             component="span"
                                             className='text-[14px] text-error font-medium'
                                         />
                                     </div>
                                     <div className=''>
                                         <label htmlFor='password' className='text-[24px] text-text'>Password</label>
                                         <Field type="password" name='password' className='w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none'/>
                                         <ErrorMessage
                                             name="password"
                                             component="span"
                                             className='text-[14px] text-error font-medium'
                                         />
                                     </div>
                                     <div className='py-[12px]'>
                                     <button type='submit' disabled={formik.isSubmitting} className="bg-switch hover:opacity-80 text-white h-[68px] py-[8px] font-medium text-[32px] rounded-[16px] w-full">Login</button>
                                     </div>
                                     <div className='text-center space-y-[8px]'>
                                         <p className='text-text font-normal text-[20px] tablet:text-[22px]'>Don't have an account? <span className='underline'><Link to={"/register"}>Signup</Link></span></p>
                                         <p className='text-text font-normal text-[20px] tablet:text-[22px]'><Link to={"/forgot-password"}>Forgot Password?</Link></p>
                                     </div>
                                 </form>
                                )}
                            </Formik>
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