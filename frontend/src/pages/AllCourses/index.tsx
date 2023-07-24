import React from "react";
import Navbar from "../../components/Navbar";
import CourseCard from "./CourseCard";

const handleGetCourse = () => {};

const courseList = [
    {
        id: 1,
        isOwner: true,
        title: "Khóa học MYSQL dành cho newbie",
        thumbnail: "course.thumbnail",
        rating: 5,
        status: true,
        numberOfSection: 10,
        slug: "MYSQL",
        summary: "Đây là khóa học rẻ nhất chưa từng có",
        author: "course.author",
    },
    {
        id: 2,
        isOwner: false,
        title: "Khóa học MYSQL dành cho newbie",
        thumbnail: "course.thumbnail",
        rating: 5,
        status: true,
        numberOfSection: 10,
        slug: "MYSQL",
        summary: "Đây là khóa học rẻ nhất chưa từng có",
        author: "course.author",
    },
    {
        id: 3,
        isOwner: true,
        title: "Khóa học MYSQL dành cho newbie",
        thumbnail: "course.thumbnail",
        rating: 5,
        status: true,
        numberOfSection: 10,
        slug: "MYSQL",
        summary: "Đây là khóa học rẻ nhất chưa từng có",
        author: "course.author",
    },
];

const AllCourses: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="">
                    <h1 className="text-2xl">10 results for Nodejs</h1>
                    <div className="flex gap-4">
                        <div className="hidden laptop:block w-[300px] mt-4">
                            <div className="">
                                <button className="btn btn-secondary text-lg mr-4">Filter</button>
                                <button className="btn btn-secondary text-lg">Sorting by</button>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-2xl font-bold">Evaluate</h2>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="radio" />
                                    <span className="text-xl">5 stars</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="radio" />
                                    <span className="text-xl">4 stars</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="radio" />
                                    <span className="text-xl">3 stars</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="radio" />
                                    <span className="text-xl">2 stars</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="radio" />
                                    <span className="text-xl">1 stars</span>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="mt-3">
                                <h2 className="text-2xl font-bold">Category</h2>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" />
                                    <span className="text-xl">Nodejs</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" />
                                    <span className="text-xl">Nodejs</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" />
                                    <span className="text-xl">Nodejs</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" />
                                    <span className="text-xl">Nodejs</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <input type="checkbox" />
                                    <span className="text-xl">Nodejs</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            {courseList.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    isOwner={course.isOwner}
                                    title={course.title}
                                    thumbnail={course.thumbnail}
                                    rating={course.rating}
                                    status={course.status}
                                    numberOfSection={course.numberOfSection}
                                    slug={course.slug}
                                    summary={course.summary}
                                    author={course.author}
                                    handleGetCourse={handleGetCourse}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllCourses;
