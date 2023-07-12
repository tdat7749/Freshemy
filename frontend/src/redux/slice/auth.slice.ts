<<<<<<< HEAD
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { login as loginAPI, getMe as getMeAPI } from "../../apis/auth";
import { Login as LoginType } from "../../types/auth";
import { User as UserType } from "../../types/user";

type Auth = {
    user: User;
};
=======
import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../types/user'


type Auth = {
    user: User
}
>>>>>>> 1101f896025d76ca31b1cf07a66bb59236713c79

const initialState: Auth = {
    user: {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
<<<<<<< HEAD
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
=======
        id: undefined
    }
}

const AuthSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {

    }
})
>>>>>>> 1101f896025d76ca31b1cf07a66bb59236713c79
