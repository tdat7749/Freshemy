import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";

import { createCourse as createCourseAPI, getCategories as getCategoriesAPI } from "../../apis/course";
import { CreateCourse, Category } from "../../types/course"
type CourseSlice = {
    categories: Category[];
    error: string;
    message: string;
    isLoading: boolean
};


export const createCourses = createAsyncThunk<Response<null>, CreateCourse, { rejectValue: Response<null> }>(
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


const initialState: CourseSlice = {
    categories: [],
    error: "",
    message: "",
    isLoading: false
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
            //const category = state.categories.splice(payload.payload, 1)[0];
            //state.createCourse.categories.push(category);
        },
        removeCategories: (state, payload: PayloadAction<number>) => {
            //const category: Category = state.createCourse.categories.splice(payload.payload, 1)[0];
            //state.categories.push(category);
        },
        setCategories: (state, payload: PayloadAction<Category[]>) => {
            state.categories = payload.payload;
        },
        reset: (state) => {
            // state.categories = [...state.categories, ...state.createCourse.categories]
            // state.createCourse.title = '';
            // state.createCourse.categories = [];
            // state.createCourse.status = 0;
            // state.createCourse.summary = '';
            // state.createCourse.description = '';
        },
        // setMessageEmpty: (state) => {
        //     state.error = "";
        //     state.message = "";
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(createCourses.pending, (state) => {
            state.error = ""
            state.message = ""
            state.isLoading = true
        })
        builder.addCase(createCourses.fulfilled, (state, action) => {
            state.message = action.payload.message
            state.isLoading = false
        })
        builder.addCase(createCourses.rejected, (state, action) => {
            state.error = action.payload?.message as string
            state.isLoading = false
        })
    }
});

export const { setError, setCategories, addCategories, removeCategories, reset } = courseSlice.actions;

export default courseSlice.reducer;

// export const createCourse = (values: CreateCourse) => async (dispatch: any) => {
//     try {
//         const response = await createCourseApi(values);
//         if (response) {
//             if (response.status >= 200 && response.status <= 299) {
//                 dispatch(setError(response.data.message));
//             } else {
//                 dispatch(setError(response.data.message));
//             }
//         }
//     } catch (error: any) {
//         dispatch(setError(error.data.message));
//     }
// };

export const getCategories = () => async (dispatch: any) => {
    const response = await getCategoriesAPI();
    dispatch(setCategories(response.data.data.categories))

};

