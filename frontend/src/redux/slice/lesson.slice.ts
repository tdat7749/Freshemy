import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { addLesson as addLessonAPI } from "../../apis/lesson";
import { AddLesson as AddLessonType, Lesson } from "../../types/lesson";
import { Response } from "../../types/response";
import LessonApis from "../../apis/lesson";

type LessonSlice = {
    error: string;
    message: string;
    isLoading: boolean;
    lessonList: Lesson[];
}

const initialState: LessonSlice = {
    error: "",
    message: "",
    isLoading: false,
    lessonList: [],
};

export const addLesson = createAsyncThunk<Response<null>, AddLessonType, { rejectValue: Response<null> }>(
    "lesson/addLesson",
    async (body, ThunkAPI) => {
        try {
            // const response = await addLessonAPI(body);
            const response = await LessonApis.addLesson(body);
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
    },
    extraReducers: (builder) => {
        builder.addCase(addLesson.pending, (state) => {
            state.error = "";
            state.message = "";
            state.isLoading = true;
        });
        builder.addCase(addLesson.fulfilled, (state, action) => {
            state.lessonList = [...state.lessonList, action.payload.data] as Lesson[];
            state.isLoading = false;
        });
        builder.addCase(addLesson.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });
    },
});
