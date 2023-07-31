import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { Login as LoginType, Register as RegisterType, Token as TokenType } from "../../types/auth";
import { ForgotPassword as ForgotPasswordType } from "../../types/auth";
import { ResetPassword as ResetPasswordType } from "../../types/auth";
import { User as UserType } from "../../types/user";
import Cookies from "js-cookie";
import { Response } from "../../types/response";
import { AuthApis } from "@src/apis";

type AuthSlice = {
    user: User;
    isLogin: boolean;
    isLoading: boolean;
    role: Role;
    error: string;
    success: string;
};
enum Role {
    UnenrolledUser = "UnenrolledUser",
    EnrolledUser = "EnrolledUser",
    Author = "Author",
}

export const login = createAsyncThunk<Response<TokenType>, LoginType, { rejectValue: Response<null> }>(
    "auth/login",
    async (body, ThunkAPI) => {
        try {
            const response = await AuthApis.login(body);
            return response.data as Response<TokenType>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const register = createAsyncThunk<Response<null>, RegisterType, { rejectValue: Response<null> }>(
    "auth/register",
    async (body, ThunkAPI) => {
        try {
            const response = await AuthApis.register(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const forgotPassword = createAsyncThunk<Response<null>, ForgotPasswordType, { rejectValue: Response<null> }>(
    "auth/forgotPassword",
    async (body, ThunkAPI) => {
        try {
            const response = await AuthApis.forgotPassword(body.email);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const resetPassword = createAsyncThunk<Response<null>, ResetPasswordType, { rejectValue: Response<null> }>(
    "auth/resetPassword",
    async (body, ThunkAPI) => {
        try {
            const response = await AuthApis.resetPassword(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const verifyEmail = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
    "auth/verifyEmail",
    async (body, ThunkAPI) => {
        try {
            const response = await AuthApis.verifyEmail(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: AuthSlice = {
    user: {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        id: undefined,
    },
    isLogin: false,
    isLoading: false,
    role: Role.UnenrolledUser,
    error: "",
    success: "",
};

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<UserType>) => {
            state.user.description = action.payload.description;
            state.user.email = action.payload.email;
            state.user.first_name = action.payload.first_name;
            state.user.last_name = action.payload.last_name;

            state.isLogin = true;
        },
        setLogout: (state) => {
            state.isLogin = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            Cookies.set("accessToken", action.payload.data?.accessToken as string);
            Cookies.set("refreshToken", action.payload.data?.refreshToken as string);

            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state) => {
            state.isLoading = false;
        });

        //
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(register.rejected, (state) => {
            state.isLoading = false;
        });

        //
        builder.addCase(forgotPassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(forgotPassword.rejected, (state) => {
            state.isLoading = false;
        });

        //
        builder.addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(resetPassword.rejected, (state) => {
            state.isLoading = false;
        });

        //
        builder.addCase(verifyEmail.pending, (state) => {
            state.error = "";
            state.success = "";
            state.isLoading = true;
        });
        builder.addCase(verifyEmail.fulfilled, (state, action) => {
            state.success = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(verifyEmail.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });
    },
});

export const { setUsers, setLogout } = authSlice.actions;

export default authSlice.reducer;

export const getMe = () => async (dispatch: any) => {
    try {
        const response = await AuthApis.getMe();

        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                dispatch(setUsers(response.data.data));
            } else {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                window.location.href = "/login";
            }
        }
    } catch (error: any) {}
};

export const refreshToken = async () => {
    try {
        const response = await AuthApis.refreshToken();

        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                Cookies.set("accessToken", response.data.data.accessToken);
            } else {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                window.location.href = "/login";
            }
        }
    } catch (error: any) {
        console.log(error);
    }
};

export const logout = () => async (dispatch: any) => {
    dispatch(
        setUsers({
            description: undefined,
            first_name: undefined,
            last_name: undefined,
            email: undefined,
        })
    );
    dispatch(setLogout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};
