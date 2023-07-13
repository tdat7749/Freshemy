import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    return (
        <>
            <Header isLogin={true} />
            <h1 className="text-3xl font-bold underline text-orange-300 h-[2000px]">Hellaao</h1>
            <Footer />
        </>
    );
};

export default Home;
