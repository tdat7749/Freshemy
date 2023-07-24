import React from "react";

interface CategoryProps {}

const Category: React.FC<CategoryProps> = (props) => {
    return (
        <div className="rounded-lg shadow-lg flex flex-col hover:scale-95 cursor-pointer max-w-[300px] p-2">
            <div className="mobile:h-[100px] tablet:h-[300px]">
                <img
                    src="https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg"
                    alt={""}
                    className="w-full h-full rounded-lg bg-black object-cover"
                />
            </div>
            <h2 className="font-bold text-title text-lg text-ellipsis overflow-hidden whitespace-wrap text-center py-4">
                Nodejs
            </h2>
        </div>
    );
};

export default Category;
