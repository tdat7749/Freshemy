import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    return (
        <>
            <Header isLogin={true} />
            <h1 className="text-3xl font-bold underline text-orange-300 ">Hellaao</h1>
            <a href="/change-password">Change Password</a>
            <Footer />
        </>
    );
};

export default Home;
