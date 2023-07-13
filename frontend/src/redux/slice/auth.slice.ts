import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import {
    login as loginAPI,
    getMe as getMeAPI,
    forgotPassword as forgotPasswordAPI,
    resetPassword as resetPasswordAPI,
} from "../../apis/auth";
import { Login as LoginType } from "../../types/auth";
import { ForgotPassword as ForgotPasswordType } from "../../types/auth";
import { ResetPassword as ResetPasswordType } from "../../types/auth";
import { User as UserType } from "../../types/user";

type Auth = {
    user: User;
};

const initialState: Auth = {
    user: {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        id: undefined,
    },
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
        },
    },
});

export const { setUsers } = authSlice.actions;

export default authSlice.reducer;

export const login = async (values: LoginType) => {
    try {
        const response = await loginAPI(values.email, values.password);
        if (response.status >= 200 && response.status <= 299) {
            getMe();
        } else {
            console.log(response.data.message);
        }
    } catch (error: any) {
        console.log(error);
    }
};

export const getMe = async () => {
    try {
        const response = await getMeAPI();

        if (response.status >= 200 && response.status <= 299) {
            setUsers(response.data.data);
        } else {
            console.log(response.data.message);
        }
    } catch (error: any) {
        console.log(error);
    }
};

export const forgotPassword = async (values: ForgotPasswordType) => {
    try {
        const response = await forgotPasswordAPI(values.email);
        console.log(response.data.message);
    } catch (error: any) {
        console.log(error);
    }
};

export const resetPassword = async (values: ResetPasswordType, token: string) => {
    try {
        const response = await resetPasswordAPI(values.confirmPassword, values.password, token);
        if(response.data.status_code === 200) {
            window.location.href = '/login'
        }
        if(response.data.status_code === 400) {
            window.location.href = '/login'
        }
    } catch (error: any) {
        console.log(error);
    }
};
