// import React, { useEffect, useState } from "react";
// import React, { useEffect } from "react";

import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const CourseDetail: React.FC = () => {
    // let { slug } = useParams();
    // const dispatch = useAppDispatch();
    // const [courseDetail, setCourseDetail] = useState({});
    let courseDetailSelector = {
        data: {
            id: 1,
            slug: "1-2-3",
            thumbnail:
                "https://th.bing.com/th/id/R.67cfaa26978bf61a369b6b62877ca1ce?rik=clnIRqpQ5iJ01w&riu=http%3a%2f%2fthuthuatphanmem.vn%2fuploads%2f2018%2f05%2f23%2fwallpaper-4k-hinh-nen-4k-ho-nuoc-menh-mong-cuc-dep_101311625.jpg&ehk=CVsexA0rlVLJq7d%2fQ%2bIfbJIeLSEYU%2biSSmRKMevXEyM%3d&risl=&pid=ImgRaw&r=0",
            title: "1 2 3",
            status: "Completed",
            categories: [
                {
                    id: 1,

                    title: "NodeJs",
                },
                {
                    id: 2,

                    title: "ReactJs",
                },
            ],
            summary: "ahjhjhjhjhjhj",
            author: {
                first_name: "Vuong",
                last_name: "Hoang",
                id: 2,
            },
            ratings: 5,
            description: "hãy học cái nì đi",
            sections: [
                {
                    id: 1,
                    title: "khoas HOJC AHJ",
                    lessons: [
                        {
                            title: "B1",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                        {
                            title: "B2",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                        {
                            title: "B3",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                        {
                            title: "B4",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                    ],
                },
                {
                    id: 2,
                    title: "C2",
                    lessons: [
                        {
                            title: "C1",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                        {
                            title: "C2",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                        {
                            title: "C3",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                        {
                            title: "C4",
                            url_video: "https://www.youtube.com/watch?v=pTFZFxd4hOI",
                        },
                    ],
                },
            ],
            created_at: "12/2/2023",
            updated_at: "12/2/2023",
        },
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen h-full container px-4 m-auto">
                <div>
                    <div className="description">
                        <h2>Description</h2>
                        <p>feqfegegegeg</p>
                    </div>

                    <div className="table-of-content">
                        <h2>Table of Content</h2>
                        {courseDetailSelector.data.sections.map((section) => {
                            return <Accordion isDisplayBtn={false} section={section} />;
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
