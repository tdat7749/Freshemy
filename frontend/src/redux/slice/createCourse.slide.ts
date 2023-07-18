import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { createCourse as createCourseApi, getCategories as getCategoriesApi } from "../../apis/createCourse";
import {CreateCourse, Category } from "../../types/course"
export type create = {
    createCourse: CreateCourse;
    categories: Category[];
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
    categories: [],
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
            state.createCourse.summary = payload.payload.summary;
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
        addCategories: (state, payload: PayloadAction<number>) => {
            const category = state.categories.splice(payload.payload, 1)[0];
            state.createCourse.categories.push(category);
        },
        removeCategories: (state, payload: PayloadAction<number>) => {
            const category: Category = state.createCourse.categories.splice(payload.payload, 1)[0];
            state.categories.push(category);
        },
        setCategories: (state, payload: PayloadAction<Category[]>) => {
            state.categories = payload.payload;
        },
        reset: (state) => {
            state.categories = [...state.categories, ...state.createCourse.categories]
            state.createCourse.title ='';
            state.createCourse.categories = [];
            state.createCourse.status = '';
            state.createCourse.summary = '';
            state.createCourse.description = '';
        },
        // setMessageEmpty: (state) => {
        //     state.error = "";
        //     state.message = "";
        // },
    },
});

export const { setCourse, setError, setCategories, addCategories, removeCategories, reset } = courseSlice.actions;

export default courseSlice.reducer;

export const createCourse = (values: CreateCourse) => async (dispatch: any) => {
    try {
        const response = await createCourseApi(values);
        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                dispatch(setError(response.data.message));
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};

export const getCategories = () => async (dispatch: any) => {
        const response = await getCategoriesApi();
        dispatch(setCategories(response.data.data.categories))
      
};

