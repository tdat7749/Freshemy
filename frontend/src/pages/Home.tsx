import React from "react";
import Header from "../components/Header";

const Home: React.FC = () => {
  return (
    <>
      <Header isLogin={false} />
      <h1 className="text-3xl font-bold underline text-orange-300">Hellaao</h1>
    </>
  );
};

export default Home;
