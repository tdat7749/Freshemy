import React from "react";

const Navbar: React.FC = () => {
    return (
        <>
            <div className="w-full h-[80px] bg-backgroundHover mt-[100px] flex items-center">
                <ul className="container mx-auto flex justify-between items-center overflow-x-hidden max-w-[2/5]">
                    <li className="cursor-pointer hover:bg-[#AD652B] hover:text-white p-7 min-w-fit">Web programming</li>
                    <li className="cursor-pointer hover:bg-[#AD652B] hover:text-white p-7 min-w-fit">Web programming</li>
                    <li className="cursor-pointer hover:bg-[#AD652B] hover:text-white p-7 min-w-fit">Web programming</li>
                    <li className="cursor-pointer hover:bg-[#AD652B] hover:text-white p-7 min-w-fit">Web programming</li>
                    <li className="cursor-pointer hover:bg-[#AD652B] hover:text-white p-7 min-w-fit">Web programming</li>
                    <li className="cursor-pointer hover:bg-[#AD652B] hover:text-white p-7 min-w-fit">Web programming</li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;
