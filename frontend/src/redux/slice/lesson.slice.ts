import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { addLesson as addLessonAPI } from "../../apis/lessons";
import { AddLesson as AddLessonType } from "../../types/lesson";
import { Response } from "../../types/response";

type UserSlice = {
    error: "",
    message: "",
    isLoading: false,
}
const initialState: UserSlice = {
    error: "",
    message: "",
    isLoading: false,
};

export const addLesson = createAsyncThunk<Response<null>, AddLessonType, { rejectValue: Response<null> }>(
    "lessons",
    async (body, ThunkAPI) => {
        try {
            const response = await addLessonAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const lessonSlice = createSlice({
    name: "lesson",
    initialState: initialState,
    reducers: {},
});


