import { PayloadAction, createSlice } from "@reduxjs/toolkit";



import { CreateCourse } from "../../types/course";


type create = {
    createCourse: CreateCourse;
    error: string;
    message: string;
};

const initialState: create = {
    createCourse: {
        title: "",
        categories: [],
        status: "uncomplete",
        summary: "",
        description: "",
    },
    error: "",
    message: "",
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setCourse: (state, payload: PayloadAction<CreateCourse>) => {
            state.createCourse.title = payload.payload.title;
            state.createCourse.categories = payload.payload.categories;
            state.createCourse.status = payload.payload.status;
            state.createCourse.description = payload.payload.description;
        },
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
        setMessageEmpty: (state) => {
            state.error = "";
            state.message = "";
        },
        // setLogout: (state) => {
        //     state.isLogin = false;
        // },
        // setMessageEmpty: (state) => {
        //     state.error = "";
        //     state.message = "";
        // },
    },
});

export const { setCourse } = courseSlice.actions;

export default courseSlice.reducer;

export const createCourse = (values: CreateCourse) => async (dispatch: any) => {
    dispatch(setCourse(values));
};
