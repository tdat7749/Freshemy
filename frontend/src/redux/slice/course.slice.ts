import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getMyCourses as getMyCoursesAPI, deleteCourse as deleteCourseAPI } from "../../apis/courses";
import { Course as CourseType, getMyCourses as getMyCoursesType } from "../../types/course";

type CourseSlice = {
    message: string;
    error: string;
    course: CourseType[];
    totalPage: number;
};

const initialState: CourseSlice = {
    message: "",
    error: "",
    course: [],
    totalPage: 1,
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setTotalPage: (state, payload: PayloadAction<number>) => {
            state.totalPage = payload.payload;
        },
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

export const { setTotalPage, setCourseList, setMessage, setError } = courseSlice.actions;

// @ts-ignore
export const getMyCourses = (values: getMyCoursesType) => async (dispatch, getState) => {
    try {
        const response = await getMyCoursesAPI(values.pageIndex, values.keyword);
        if (response) {
            if (response.status >= 200) {
                dispatch(setCourseList(response.data.courses));
                dispatch(setTotalPage(response.data.total_page));
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};

// @ts-ignore
export const deleteCourse = (courseId: number) => async (dispatch, getState) => {
    try {
        const response = await deleteCourseAPI(courseId);
        if (response) {
            if (response.status >= 200) {
                // dispatch(setMessage(response.data.message));
                console.log(response.data.message)
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};
