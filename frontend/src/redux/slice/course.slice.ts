import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getMyCourses as getMyCoursesAPI } from "../../apis/courses";
import { Course as CourseType, getMyCourses as getMyCoursesType } from "../../types/course";

type CourseSlice = {
    message: string;
    error: string;
    course: CourseType[],
};

const initialState: CourseSlice = {
    message: "",
    error: "",
    course: []
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setCourseList: (state, payload: PayloadAction<CourseType[]>) => {
            state.course = payload.payload;
        },
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
    },
});

export default courseSlice.reducer;

export const { setCourseList, setMessage, setError } = courseSlice.actions;

// @ts-ignore
export const getMyCourses = (values: getMyCoursesType) => async (dispatch, getState) => {
    try {
        const response = await getMyCoursesAPI(values.page_index, values.keyword);
        if (response) {
            if (response.status >= 200) {
                dispatch(setCourseList(response.data.courses));
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};
