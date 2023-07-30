import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AddLesson as AddLessonType, Lesson, orderLesson } from "../../types/lesson";
import { Response } from "../../types/response";
import LessonApis from "@src/apis/lesson";

type LessonSlice = {
    order: orderLesson[];
    isLoading: boolean;
    lessonList: Lesson[];
};

const initialState: LessonSlice = {
    order: [],
    isLoading: false,
    lessonList: [],
};

export const addLesson = createAsyncThunk<Response<null>, AddLessonType, { rejectValue: Response<null> }>(
    "lesson/addLesson",
    async (body, ThunkAPI) => {
        try {
            const response = await LessonApis.addLesson(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const deleteLesson = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "lesson/deleteLesson",
    async (body, ThunkAPI) => {
        try {
            const response = await LessonApis.deleteLesson(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const reOrderLesson = createAsyncThunk<Response<null>, any, { rejectValue: Response<null> }>(
    "lesson/reOrderLesson",
    async (body, ThunkAPI) => {
        try {
            const response = await LessonApis.reOrderLesson(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const lessonSlice = createSlice({
    name: "lesson",
    initialState: initialState,
    reducers: {
        setAddLesson: (state, action: PayloadAction<Lesson>) => {
            state.lessonList = state.lessonList.map((lesson: Lesson) => {
                if (lesson.id === action.payload.id) {
                    lesson.title = action.payload.title;
                }
                return lesson;
            });
        },
        setDeleteLesson: (state, action: PayloadAction<number>) => {
            state.lessonList = state.lessonList.filter((lesson: Lesson) => lesson.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addLesson.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addLesson.fulfilled, (state, action) => {
            state.lessonList = [...state.lessonList, action.payload.data] as Lesson[];
            state.isLoading = false;
        });
        builder.addCase(addLesson.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteLesson.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteLesson.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(deleteLesson.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});

export const { setAddLesson, setDeleteLesson } = lessonSlice.actions;

export default lessonSlice.reducer;
