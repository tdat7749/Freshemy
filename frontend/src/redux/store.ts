import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import authSlice from "./slice/auth.slice";
import sectionSlice from "./slice/section.slice";
import userSlice from "./slice/user.slice";

const store: ToolkitStore = configureStore({
    reducer: {
        authSlice: authSlice,
        userSlice: userSlice,
        sectionSlice: sectionSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
