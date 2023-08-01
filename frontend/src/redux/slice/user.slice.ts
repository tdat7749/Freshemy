import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    AuthorInformation,
    ChangePassword as ChangePasswordType,
    UpdateInformation as UpdateInformationType,
    User,
} from "../../types/user";
import { Response } from "../../types/response";
import UserApis from "@src/apis/user";
import { Course } from "../../types/course";

type UserSlice = {
    isLoading: boolean;
    user: User;
    course: Course[];
};

const initialState: UserSlice = {
    isLoading: false,
    user: {
        url_avatar: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        description: "",
    },
    course: [
        {
            id: 0,
            title: "",
            summary: "",
            rating: 0,
            thumbnail: "",
            author: "",
            categories: [],
            number_section: 0,
            status: false,
            attendees: 0,
            slug: "",
        },
    ],
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

export const getInformation = createAsyncThunk<Response<User>, null, { rejectValue: Response<null> }>(
    "users/getInformation",
    async (body, ThunkAPI) => {
        try {
            const response = await UserApis.getInformation();
            return response.data as Response<User>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const updateInformation = createAsyncThunk<
    Response<User>,
    UpdateInformationType,
    { rejectValue: Response<null> }
>("users/updateInformation", async (body, ThunkAPI) => {
    try {
        const response = await UserApis.updateInformation(body);
        return response.data as Response<User>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const getAuthorInformation = createAsyncThunk<
    Response<AuthorInformation>,
    number,
    { rejectValue: Response<null> }
>("users/getAuthorInformation", async (body, ThunkAPI) => {
    try {
        const response = await UserApis.getAuthorInformation(body);
        return response.data as Response<AuthorInformation>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const userSlice = createSlice({
    name: "users",
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

        builder.addCase(getInformation.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getInformation.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data as User;
        });
        builder.addCase(getInformation.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getAuthorInformation.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAuthorInformation.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data as User;
            state.course = action.payload.data?.courses as Course[];
        });
        builder.addCase(getAuthorInformation.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export default userSlice.reducer;
