import { FC } from "react";
import Logo from "../assets/images/logo.png";

const Spin: FC = () => {
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 left-0 flex flex-col items-center justify-center bg-black/20">
                <img src={Logo} alt="Waiting..." className="rounded-full animate-spin" />
                <span className="text-xl font-bold animate-pulse">Waiting...</span>
            </div>
        </>
    );
};

export default Spin;
