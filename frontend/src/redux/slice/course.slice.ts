import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getMyCourses as getMyCoursesAPI, deleteCourse as deleteCourseAPI } from "../../apis/courses";
import {
    Course,
    Course as CourseType,
    PagingCourse,
    deleteCourse as deleteCourseType,
    getMyCourses as getMyCoursesType,
} from "../../types/course";
import { Response } from "../../types/response";

type CourseSlice = {
    message: string;
    error: string;
    courses: CourseType[];
    isLoading: boolean;
    totalPage: number;
};

export const getMyCourses = createAsyncThunk<Response<PagingCourse>, getMyCoursesType, { rejectValue: Response<null> }>(
    "course/getMyCourses",
    async (body, ThunkAPI) => {
        try {
            const response = await getMyCoursesAPI(body);
            return response.data as Response<PagingCourse>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const deleteCourse = createAsyncThunk<Response<null>, deleteCourseType, { rejectValue: Response<null> }>(
    "course/deleteCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await deleteCourseAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: CourseSlice = {
    message: "",
    error: "",
    courses: [],
    isLoading: false,
    totalPage: 1,
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(getMyCourses.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getMyCourses.fulfilled, (state, action) => {
            console.log(action.payload.data);
            state.courses = action.payload.data?.courses as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isLoading = false;
        });

        builder.addCase(getMyCourses.rejected, (state, action) => {
            state.message = action.payload?.message as string;
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(deleteCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.rejected, (state, action) => {
            state.message = action.payload?.message as string;
            state.error = action.error as string;
            state.isLoading = false;
        });
    },
});

export default courseSlice.reducer;
