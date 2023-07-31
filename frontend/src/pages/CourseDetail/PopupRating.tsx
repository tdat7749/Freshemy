import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { RatingCourse as RatingCourseType } from "../../types/course";
import RatingInPopup from "./RatingInPopup";
import { useAppDispatch } from "../../hooks/hooks";
import { courseActions } from "@redux/slice";
import toast, { Toaster } from "react-hot-toast";
// import i18n from "../utils/i18next";

type RatingCourseProps = {
    handleCancel: () => void;
    course_id: number | undefined;
};

const PopupRating: React.FC<RatingCourseProps> = (props) => {
    const course_id = props.course_id;
    const [checked, setChecked] = useState(5);
    const formikRef = useRef(null);
    const dispatch = useAppDispatch();
    const initialValue = {
        content: "",
    };
    const handleCheck = (event: any) => {
        const rating = event.target.id;
        setChecked(Number(rating));
    };

    const handleOnSubmit = (values: any) => {
        const data: RatingCourseType = {
            ...values,
            course_id,
            ratings: checked,
        };
        console.log(data);
        //@ts-ignore
        dispatch(courseActions.ratingCourse(data)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success("Rate Successfully");
                props.handleCancel();
            } else {
                toast.error("Rate Unsuccessfully");
            }
        });
    };

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <Formik initialValues={initialValue} onSubmit={handleOnSubmit} innerRef={formikRef}>
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                <div className="px-5 py-3 flex items-center space-x-4">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Vote: {checked}
                                    </label>
                                    <RatingInPopup handleCheck={handleCheck} />
                                </div>
                                <div className="px-5 py-3">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Comment:
                                    </label>{" "}
                                    <br />
                                    <Field
                                        as="textarea"
                                        name="content"
                                        className={` w-full px-2 py-2 rounded-lg border-[1px] outline-none  `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="content"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>

                                <div className="flex justify-end px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="btn btn-primary text-white text-lg"
                                        // disabled={error !== "" || isLoading ? true : false}
                                    >
                                        SAVE
                                        {/* {isLoading ? "Loading..." : "Save"} */}
                                    </button>
                                    <button onClick={props.handleCancel} type="button" className="btn text-lg ml-2">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default PopupRating;
