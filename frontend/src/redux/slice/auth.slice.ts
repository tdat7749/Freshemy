import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../types/user'


type Auth = {
    user: User
}

const initialState: Auth = {
    user: {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
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