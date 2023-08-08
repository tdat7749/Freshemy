import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <>
            <div className="h-[calc(100vh-100px)] flex items-center flex-col space-y-[10px] justify-center">
                <h1 className="text-4xl text-error">404 NOT FOUND</h1>
                <Link to={"/"} className="text-switch text-xl underline">
                    Back to Home
                </Link>
            </div>
        </>
    );
};

export default NotFound;
