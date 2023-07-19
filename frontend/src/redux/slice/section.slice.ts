import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addSection as addSectionAPI } from "../../apis/section";
import { Section } from "../../types/section";

type SectionSlice = {
    error: string;
    message: string;
    title: string;
    sectionList: Section[];
};

const initialState: SectionSlice = {
    error: "",
    message: "",
    title: "",
    sectionList: [],
};

export const sectionSlice = createSlice({
    name: "section",
    initialState: initialState,
    reducers: {
        setSection: (state, payload: PayloadAction<Section>) => {
            state.sectionList.push(payload.payload);
        },
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
    },
});

export const { setSection, setError, setMessage } = sectionSlice.actions;

export default sectionSlice.reducer;

export const addSection = (values: Section) => async (dispatch: any) => {
    try {
        const response = await addSectionAPI(values);
        if (response) {
            if (response.status >= 200) {
                dispatch(setSection(values));
                dispatch(setMessage(response.data.message));
            } else {
                dispatch(setError(response.data.message));
            }
        }
    } catch (error: any) {}
};
