import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import {
    register as registerAPI, login as loginAPI,
    getMe as getMeAPI,
    forgotPassword as forgotPasswordAPI,
    resetPassword as resetPasswordAPI,
    refreshToken as refreshTokenAPI,
} from "../../apis/auth";

import { Login as LoginType, Register as RegisterType} from "../../types/auth";
import { ForgotPassword as ForgotPasswordType } from "../../types/auth";
import { ResetPassword as ResetPasswordType } from "../../types/auth";
import { User as UserType } from "../../types/user";
import Cookies from "js-cookie";

type Auth = {
    user: User;
    isLogin: boolean;
    error: string;
    message: string;
};

const initialState: Auth = {
    user: {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        id: undefined,
    },
    isLogin: false,
    error: "",
    message: "",
};

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setUsers: (state, payload: PayloadAction<UserType>) => {
            state.user.description = payload.payload.description;
            state.user.email = payload.payload.email;
            state.user.first_name = payload.payload.first_name;
            state.user.last_name = payload.payload.last_name;

            state.isLogin = true;
        },
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
    },
});

export const { setUsers, setError, setMessage } = authSlice.actions;

export default authSlice.reducer;

// @ts-ignore
export const login = (values: LoginType) => async (dispatch) => {
    try {
        const response = await loginAPI(values.email, values.password);
        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                Cookies.set("accessToken", response.data.data.accessToken);
                Cookies.set("refreshToken", response.data.data.refreshToken);
                dispatch(getMe());
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
        console.log(error);
    }
};



export const register = (values: RegisterType) => async ()  => {
    try {
        const response = await registerAPI(values);

        if (response.status >= 200 && response.status <= 299) {
            // Handle successful registration if needed
        } else {
            console.log(response.data.message);
        }
    } catch (error: any) {
        console.log(error);
    }
};


// @ts-ignore
export const getMe = () => async (dispatch) => {
    try {
        const response = await getMeAPI();

        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                dispatch(setUsers(response.data.data));
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

//@ts-ignore
export const forgotPassword = (values: ForgotPasswordType) => async (dispatch, getState) => {
    dispatch(setError(""));
    dispatch(setMessage(""));
    try {
        const response = await forgotPasswordAPI(values.email);
        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                dispatch(setMessage(response.data.message));
            } else {
                dispatch(setMessage(response.data.message));
            }
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};
export const refreshToken = async () => {
    try {
        const response = await refreshTokenAPI();

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

export const resetPassword = async (values: ResetPasswordType, token: string) => {
    try {
        const response = await resetPasswordAPI(values.confirmPassword, values.password, token);
        if (response.data.status_code === 200) {
            window.location.href = "/login";
        }
        if (response.data.status_code === 400) {
            window.location.href = "/login";
        }
    } catch (error: any) {
        console.log(error);
    }
};
//@ts-ignore
export const logout = () => async (dispatch, getState) => {
    try {
        dispatch(
            setUsers({
                description: undefined,
                first_name: undefined,
                last_name: undefined,
                email: undefined,
            })
        );
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
    } catch (error: any) {
        console.log(error);
    }
};
