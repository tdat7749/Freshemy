import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import authSlice from "./slice/auth.slice";
import userSlice from "./slice/user.slice";
import courseSlice from "./slice/createCourse.slide";
const store: ToolkitStore = configureStore({
    reducer: {
        authSlice: authSlice,
        userSlice: userSlice,
        courseSlice: courseSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
