import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import testSlice from "./slice/test.slice";
import authSlice from "./slice/auth.slice";

const store: ToolkitStore = configureStore({
    reducer: {
        testSlice: testSlice,
        authSlice: authSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
