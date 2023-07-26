import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ChangePassword as ChangePasswordType } from "../../types/user";
import { Response } from "../../types/response";
import UserApis from "../../apis/user";

type UserSlice = {
    isLoading: boolean;
};

const initialState: UserSlice = {
    isLoading: false,
};

export const changePassword = createAsyncThunk<Response<null>, ChangePasswordType, { rejectValue: Response<null> }>(
    "auth/verifyEmail",
    async (body, ThunkAPI) => {
        try {
            const response = await UserApis.changePassword(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(changePassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(changePassword.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changePassword.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default userSlice.reducer;
