import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { AddLesson as AddLessonType } from "../types/lesson";
import { useAppDispatch } from "../hooks/hooks";
// import { userActions } from "../redux/slice";
import { useAppSelector } from "../hooks/hooks";
import { setMessageEmpty } from "../redux/slice/user.slice";
import { lessonActions } from "../redux/slice";
// import { addLessonValidationSchema } from "../validations/lesson";

type AddLessonModalProps = {
    handleDelete: () => void;
    handleCancel: () => void;
    id: number
};

const PopupAddLesson: React.FC<AddLessonModalProps> = (props) => {
    let message = useAppSelector((state) => state.userSlice.message) ?? "";
    let error = useAppSelector((state) => state.userSlice.error) ?? "";
    const [video, setVideo] = useState<File | null>(null);
    const dispatch = useAppDispatch();
    const formikRef = useRef(null);
    const initialValue: AddLessonType = {
        title: "",
        video: null,
        section_id:""
    };

    useEffect(() => {
        dispatch(setMessageEmpty());
    }, [dispatch]);

    const handleAddVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVideo(event.currentTarget.files![0]);
    };

    const handleOnSubmit = (values: AddLessonType) => {
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append("section_id",props.id.toString())
        formData.append("video", video as File);

        console.log(formData.get("video"),formData.get("title"))
        //@ts-ignore
        dispatch(lessonActions.addLesson(formData));
    };

    const handleChange = () => {
        error = "";
        message = "";
    };
    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <Formik initialValues={initialValue} onSubmit={handleOnSubmit} innerRef={formikRef}>
                        {(formik) => (
                            <form
                                onSubmit={formik.handleSubmit}
                                // validationSchema={addLessonValidationSchema}
                                onChange={handleChange}
                                className="w-full space-y-[5px] tablet:space-y-[20px]"
                            >
                                <div className="ml-[20px] mr-[20px]">
                                    <label htmlFor="title" className="text-[16px] text-text">
                                        Title
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="title"
                                        className={`' w-full h-[40px] rounded-[8px] px-[8px] border-[1px] border-black  outline-none ' ${
                                            formik.errors.title && formik.touched.title && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="title"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="ml-[20px] mr-[20px] ">
                                    <label htmlFor="video" className="text-[20px] text-text">
                                        Upload video
                                    </label>{" "}
                                    <br />
                                    <input
                                        id="video"
                                        ref={formikRef}
                                        type="File"
                                        name="video"
                                        className={`' w-full h-[48px] rounded-[8px] px-[8px] border-[1px] border-black bg-white outline-none mt-[15px]' ${
                                            formik.errors.video && formik.touched.video && "border-error"
                                        }`}
                                        onChange={handleAddVideo}
                                    />
                                </div>
                                {error !== "" && (
                                    <span className=" ml-[95px] tablet:ml-[170px] text-[20px] text-error font-medium ">
                                        {error}
                                    </span>
                                )}
                                {message !== "" && (
                                    <span className=" ml-[30px] tablet:ml-[100px] text-[20px] text-success font-medium">
                                        {message}
                                    </span>
                                )}
                                <div className="py-[12px]  mt-[30px] tablte:mt-[60px]">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className=" bg-switch hover:opacity-80 text-white border-black border-[1px]  w-2/5 tablet:w-[79px] h-[56px] tablet:h-[56px] 
                                        py-[8px] font-medium text-[20px] rounded-[12px] ml-[40px] tablet:ml-[315px] disabled:opacity-50 "
                                        disabled={error !== "" ? true : false}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={props.handleCancel}
                                        type="button"
                                        className="bg-white hover:opacity-80 text-black border-black border-[1px] w-2/5 tablet:w-[100px] h-[56px] tablet:h-[56px] py-[8px] font-medium text-[20px] rounded-[12px] ml-[10px]"
                                    >
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

export default PopupAddLesson;
