import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ChangePassword: React.FC = () => {
    return (
        <>
            <Header isLogin={true} />
            <form className=' w-[361px] tablet:w-[505px] h-[570px] tablet:h-[605px] pt-[15px] rounded-xl border-[2px]  bg-[#F7F1DD] flex flex-col mt-[130px] m-auto'>
            <h1 className='ml-[25px] tablet:ml-[55px] text-[32px] tablet:text-[40px]  font-bold mb-[5px]'>CHANGE PASSWORD</h1>
            <div className='ml-[15px] tablet:ml-[30px] h-[126px] tablet:h-[123px] mt-[10px]'>
                <h3 className='text-[24px] mr-[130px] tablet:mr-[245px] mb-[5px]'>Current password</h3>  
                <input className='w-[329px] tablet:w-[448px] h-[68px] rounded-xl border-[2px] border-black pl-[15px] text-[20px]'type="text" name="current-pass" id="current-pass" />
                <h3 className='text-red-600 text-[14px] mr-[290px] mt-[5px] tablet:mr-[405px]' >Error</h3>
            </div>
            <div className='ml-[15px] tablet:ml-[30px] h-[123px] mt-[10px]'>
                <h3 className='text-[24px] mr-[160px] tablet:mr-[275px] mb-[5px]' >New password</h3>  
                <input className='w-[329px] tablet:w-[448px] h-[68px] rounded-xl border-[2px] border-black pl-[15px] text-[20px] 'type="text" name="new-pass" id="new-pass" />
                <h3 className='text-red-600 text-[14px] mr-[290px] mt-[5px] tablet:mr-[405px]' >Error</h3>
            </div>
            <div className='ml-[15px] tablet:ml-[30px] h-[123px] mt-[10px]'>
                <h3 className='text-[24px] mr-[130px] tablet:mr-[245px] mb-[5px]' >Confirm password</h3>  
                <input className='w-[329px] tablet:w-[448px] h-[68px] rounded-xl border-[2px] border-black pl-[15px] text-[20px]'type="text" name="confirm-pass" id="confirm-pass" />
                <h3 className='text-red-600 text-[14px] mr-[290px] mt-[5px] tablet:mr-[405px]' >Error</h3>
            </div>
            <div className='h-[123px] mt-[15px] tablet:mt-[35px]'>
                <button type='submit' className='ml-[20px] tablet:ml-[280px] px-[40px] tablet:px-[18px] py-[10px] tablet:py-[18px] text-[32px] tablet:text-[20px] font-bold rounded-[8px] bg-[#033700] text-white border-[2px] border-black'>Save</button>
                <button type='submit' className=' ml-[20px] tablet:ml-[10px] px-[29px] tablet:px-[18px] py-[10px] tablet:py-[18px] text-[32px] tablet:text-[20px] rounded-[8px] bg-[#ffffff] text-black border-[1px] border-black'>Cancel</button>
            </div>
            </form>
            <Footer />
        </>
    );
};

export default ChangePassword;