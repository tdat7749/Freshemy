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
    id: number;
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
        section_id: "",
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
        formData.append("section_id", props.id.toString());
        formData.append("video", video as File);

        console.log(formData.get("video"), formData.get("title"));
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
                    <h1 className="text-3xl mb-1 font-bold text-center text-title">ADD NEW LESSON</h1>
                    <Formik initialValues={initialValue} onSubmit={handleOnSubmit} innerRef={formikRef}>
                        {(formik) => (
                            <form
                                onSubmit={formik.handleSubmit}
                                // validationSchema={addLessonValidationSchema}
                                onChange={handleChange}
                                className="text-sm mb-1 tablet:text-xl font-medium"
                            >
                                <div className="px-5 py-3">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Title
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="title"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
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
                                <div className="px-5 py-3 ">
                                    <label htmlFor="video" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Upload video
                                    </label>{" "}
                                    <br />
                                    <input
                                        id="video"
                                        ref={formikRef}
                                        type="file"
                                        name="video"
                                        className={`file-input file-input-bordered file-input-primary w-full ${
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
                                <div className="flex justify-end px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="btn btn-primary text-lg"
                                        disabled={error !== "" ? true : false}
                                    >
                                        Save
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

export default PopupAddLesson;
