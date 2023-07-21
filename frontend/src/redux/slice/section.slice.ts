import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    addSection as addSectionAPI,
    deleteSection as deleteSectionAPI,
    editSection as editSectionAPI,
} from "../../apis/section";
import { EditSection as EditSectionType, Section } from "../../types/section";
import { Response } from "../../types/response";

type SectionSlice = {
    error: string;
    message: string;
    title: string;
    sectionList: Section[];
    isLoading: boolean;
};

export const addSection = createAsyncThunk<Response<null>, Section, { rejectValue: Response<null> }>(
    "section/addSection",
    async (body, ThunkAPI) => {
        try {
            const response = await addSectionAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const editSection = createAsyncThunk<Response<null>, EditSectionType, { rejectValue: Response<null> }>(
    "section/editSection",
    async (body, ThunkAPI) => {
        try {
            const response = await editSectionAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const deleteSection = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "section/deleteSection",
    async (body, ThunkAPI) => {
        try {
            const response = await deleteSectionAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: SectionSlice = {
    error: "",
    message: "",
    title: "",
    sectionList: [],
    isLoading: false,
};

export const sectionSlice = createSlice({
    name: "section",
    initialState: initialState,
    reducers: {
        setDeleteSection: (state, action: PayloadAction<number>) => {
            state.sectionList = state.sectionList.filter((section: Section) => section.id !== action.payload);
        },
        setEditSection: (state, action: PayloadAction<Section>) => {
            state.sectionList = state.sectionList.map((section: Section) => {
                if (section.id === action.payload.id) {
                    section.title = action.payload.title;
                }
                return section;
            });
        },
    },
    extraReducers: (builder) => {
        // add section
        builder.addCase(addSection.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(addSection.fulfilled, (state, action) => {
            state.sectionList = [...state.sectionList, action.payload.data] as Section[];
            state.isLoading = false;
        });

        builder.addCase(addSection.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error as string;
        });

        // edit section
        builder.addCase(editSection.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(editSection.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(editSection.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error as string;
        });

        // delete section
        builder.addCase(deleteSection.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(deleteSection.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteSection.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error as string;
        });
    },
});

export const { setDeleteSection, setEditSection } = sectionSlice.actions;

export default sectionSlice.reducer;
