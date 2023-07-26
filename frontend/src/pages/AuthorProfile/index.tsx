import React from "react";
import { Navbar } from "@src/components";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import CardVideo from "../HomePage/CardVideo";

const AuthorProfile: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4">
                <div className="px-4 tablet:px-[60px] flex gap-4 bg-primary mt-4 p-4 rounded-lg">
                    <div className="w-32 h-32 rounded-full border">
                        <img src={DefaultAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="">
                        <h1 className="text-3xl font-bold mb-2">Dương Song</h1>
                        <p className="text-lg">
                            <span className="font-bold">About me: </span>Tôi bị kute
                        </p>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-wrap my-4 gap-4">
                    <CardVideo
                        thumbnail="https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg"
                        title="Khóa học MYSQL dành cho newbie 11111111111111111111111"
                        author="Dương Song"
                        rating={5}
                        categories={[
                            { id: 1, title: "Nodejs" },
                            { id: 2, title: "Reactjs" },
                        ]}
                    />
                    <CardVideo
                        thumbnail="https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg"
                        title="Khóa học MYSQL dành cho newbie 11111111111111111111111"
                        author="Dương Song"
                        rating={5}
                        categories={[
                            { id: 1, title: "Nodejs" },
                            { id: 2, title: "Reactjs" },
                        ]}
                    />
                    <CardVideo
                        thumbnail="https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg"
                        title="Khóa học MYSQL dành cho newbie 11111111111111111111111"
                        author="Dương Song"
                        rating={5}
                        categories={[
                            { id: 1, title: "Nodejs" },
                            { id: 2, title: "Reactjs" },
                        ]}
                    />
                    <CardVideo
                        thumbnail="https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg"
                        title="Khóa học MYSQL dành cho newbie 11111111111111111111111"
                        author="Dương Song"
                        rating={5}
                        categories={[
                            { id: 1, title: "Nodejs" },
                            { id: 2, title: "Reactjs" },
                        ]}
                    />
                </div>
            </div>
        </>
    );
};

export default AuthorProfile;
