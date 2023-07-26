import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileInformation, UploadFile } from "../../types/filestorage";
import { Response } from "../../types/response";
import FileStorageApis from "../../apis/fileStorage";

type FileStorage = {
    isLoading: boolean;
    fileInformation: FileInformation;
};

export const uploadImage = createAsyncThunk<Response<FileInformation>, UploadFile, { rejectValue: Response<null> }>(
    "fileStorage/uploadImage",
    async (body, ThunkAPI) => {
        try {
            const response = await FileStorageApis.uploadFile(body);
            return response.data as Response<FileInformation>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: FileStorage = {
    isLoading: false,
    fileInformation: {
        public_id: undefined,
        width: undefined,
        height: undefined,
        url: undefined,
    },
};

export const fileStorageSlice = createSlice({
    name: "fileStorage",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(uploadImage.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(uploadImage.fulfilled, (state, action) => {
            state.fileInformation = action.payload.data as FileInformation;
            state.isLoading = false;
        });

        builder.addCase(uploadImage.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default fileStorageSlice.reducer;
