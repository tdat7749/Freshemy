import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
import {changePassword as changePasswordAPI} from '../../apis/user'
import { ChangePassword as ChangePasswordType } from "../../types/user";

type UserSlice = {
    error:string,
    message:string
}

const initialState:UserSlice = {
    error:"",
    message:""
}


export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload
        },
    },
});


export default userSlice.reducer;

export const {setError,setMessage} = userSlice.actions

// @ts-ignore
export const changePassword = (values: ChangePasswordType) => async (dispatch, getState) => {
    dispatch(setError(""))
    dispatch(setMessage(""))
    try {
        const response = await changePasswordAPI(values);
        if(response){
            if (response.status >= 200 && response.status <= 299) {
                dispatch(setMessage(response.data.message))
            } else {
                dispatch(setError(response.data.message))
            }   
        }
    } catch (error: any) {
        dispatch(setError(error.data.message));
    }
};


