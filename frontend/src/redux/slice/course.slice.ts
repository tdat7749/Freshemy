import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";

import { createCourse as createCourseAPI, getCategories as getCategoriesAPI } from "../../apis/course";
import { NewCourse, Category } from "../../types/course";

type CourseSlice = {
    selectCategories: Category[];
    categories: Category[];
    error: string;
    message: string;
    isLoading: boolean;
};

export const createCourses = createAsyncThunk<Response<null>, NewCourse, { rejectValue: Response<null> }>(
    "course/createCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await createCourseAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCategories = createAsyncThunk<Response<Category[]>, null, { rejectValue: Response<null> }>  (
    "course/getCategories",
    async (body, ThunkAPI) => {
        try {
            const response = await getCategoriesAPI();
            return response.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: CourseSlice = {
    selectCategories: [],
    categories: [],
    error: "",
    message: "",
    isLoading: false,
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
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
            state.selectCategories.push(category);
        },
        removeCategories: (state, payload: PayloadAction<number>) => {
            const category: Category = state.selectCategories.splice(payload.payload, 1)[0];
            state.categories.push(category);
        },
        setCategories: (state, payload: PayloadAction<Category[]>) => {
            state.categories = payload.payload;
        },
        reset: (state) => {
            state.categories = [...state.categories, ...state.selectCategories];
            state.selectCategories = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createCourses.pending, (state) => {
            state.error = "";
            state.message = "";
            state.isLoading = true;
        });
        builder.addCase(createCourses.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(createCourses.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });


        builder.addCase(getCategories.pending, (state) => {
            state.error = "";
            state.message = "";
            state.isLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[]
            state.isLoading = false;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });
    },
});

export const { setError, setCategories, addCategories, removeCategories, reset } = courseSlice.actions;

export default courseSlice.reducer;



