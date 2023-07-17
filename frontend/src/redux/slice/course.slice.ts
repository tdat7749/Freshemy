import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getMyCourses as getMyCoursesAPI } from "../../apis/courses";
import { getMyCourses as getMyCoursesType } from "../../types/course";

type CourseSlice = {
    message: string;
    error: string;
};

const initialState: CourseSlice = {
    message: "",
    error: "",
};

export const courseSlide = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
    },
});

export default courseSlide.reducer;

export const { setMessage, setError } = courseSlide.actions;

// @ts-ignore
export const getMyCourses = (values: getMyCoursesType) => async (dispatch, getState) => {
    try {
        const response = await getMyCoursesAPI(values.page_index, values.keyword);
        if (response) {
            if (response.status >= 200) {
                dispatch(setMessage(response.data.message));
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};
