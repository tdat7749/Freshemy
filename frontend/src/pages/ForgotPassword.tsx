import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
    const [isDisplayNoti, setIsDisplayNoti] = useState<boolean>(false);

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleResetPasswordClick = async () => {
        // Check valid email
        const isEmailValid = validateEmail(email);
        if (isEmailValid === null) {
            setIsValidEmail(false);
        } else {
            // CALL API TO FORGOT PASSWORD
            setIsValidEmail(true);
            setIsDisplayNoti(true);
            const response = await axios.post("/api/auth/forgot-password", {
                email: email,
            });
            console.log(response);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <>
            <Header isLogin={false} />
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="bg-primary m-4 rounded-xl tablet:w-[506px]">
                    <form className="p-4">
                        <h1 className="font-bold text-[32px] text-center">FORGOT PASSWORD</h1>
                        {isDisplayNoti ? (
                            <div className="my-4 px-4 py-3 bg-[#8BC34A] rounded text-center">
                                <p className="font-bold text-xl">Check your email for further instructions</p>
                            </div>
                        ) : (
                            <></>
                        )}

                        <div className="flex flex-col mb-3">
                            <span className="text-2xl mb-1">Email</span>
                            <input
                                className={`px-2 py-[21px] rounded-lg border-[1px] ${
                                    isValidEmail ? "" : "border-error"
                                }`}
                                type="text"
                                placeholder="Enter your email..."
                                value={email}
                                onChange={handleInputChange}
                            />
                            {isValidEmail ? <></> : <span className="text-error mt-2 bt-3">Invalid email</span>}
                        </div>
                        <button
                            className="w-full py-2 px-4 mr-1 bg-switch rounded-lg text-white text-[32px] hover:opacity-80"
                            onClick={handleResetPasswordClick}
                        >
                            Reset password
                        </button>
                        <span className="block mt-3 mb-2 text-center">
                            <Link to={"/login"}>Login</Link>
                        </span>
                        <div className="text-center">
                            Don't have an account?
                            <Link to={"/signup"}>
                                <span> Signup</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPassword;
