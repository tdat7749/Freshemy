import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { login as loginAPI, getMe as getMeAPI, refreshToken as refreshTokenAPI } from "../../apis/auth";
import { Login as LoginType } from "../../types/auth";
import { User as UserType } from "../../types/user";
import Cookies from "js-cookie";

type Auth = {
    user: User;
    isLogin: boolean;
};

const initialState: Auth = {
    user: {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        id: undefined,
    },
    isLogin: false,
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

            //
            state.isLogin = true;
        },
    },
});

export const { setUsers } = authSlice.actions;

export default authSlice.reducer;

// @ts-ignore
export const login = (values: LoginType) => async (dispatch, getState) => {
    try {
        const response = await loginAPI(values.email, values.password);
        console.log(response);
        if (response.status >= 200 && response.status <= 299) {
            Cookies.set("accessToken", response.data.data.accessToken);
            Cookies.set("refreshToken", response.data.data.refreshToken);
            dispatch(getMe());
        } else {
            console.log(response.data.message);
        }
    } catch (error: any) {
        console.log(error);
    }
};

// @ts-ignore
export const getMe = () => async (dispatch, getState) => {
    try {
        const response = await getMeAPI();
        console.log("rnu getMe");

        if (response.status >= 200 && response.status <= 299) {
            console.log("run");
            dispatch(setUsers(response.data.data));
        } else {
            console.log(response.data);
        }
    } catch (error: any) {
        console.log(error);
    }
};

export const refreshToken = async () => {
    try {
        const response = await refreshTokenAPI();

        if (response.status >= 200 && response.status <= 299) {
        } else {
            Cookies.set("accessToken", response.data.data.accessToken);
            window.location.href = "/login";
        }
    } catch (error: any) {
        console.log(error);
    }
};
