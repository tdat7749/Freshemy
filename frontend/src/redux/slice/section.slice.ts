import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addSection as addSectionAPI } from "../../apis/section";
import { AddSection as AddSectionType } from "../../types/section";

const initialState = {
    error: "",
    message: "",
};

export const authSlice = createSlice({
    name: "section",
    initialState: initialState,
    reducers: {
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
    },
});

export const { setError, setMessage } = authSlice.actions;

export default authSlice.reducer;

export const addSection = (values: AddSectionType) => async (dispatch: any) => {
    try {
        const response = await addSectionAPI(values);
        if (response) {
            if (response.status_code >= 200) {
                console.log(response);
                // dispatch(setUsers(response.data.data));
            } else {
                dispatch(setError(response.message));
            }
        }
    } catch (error: any) {}
};
