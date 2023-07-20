import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";

import {
    createCourse as createCourseAPI,
    getCategories as getCategoriesAPI,
    getMyCourses as getMyCoursesAPI,
    deleteCourse as deleteCourseAPI,
    getCourseDetail as getCourseDetailAPI,
} from "../../apis/course";

import {
    NewCourse,
    Category,
    Course,
    Course as CourseType,
    PagingCourse,
    GetMyCourses as GetMyCoursesType,
    CourseDetail as CourseDetailType,
} from "../../types/course";

type CourseSlice = {
    selectCategories: Category[];
    categories: Category[];
    courses: CourseType[];
    error: string;
    message: string;
    isLoading: boolean;
    totalPage: number;
    courseDetail : CourseDetailType
};

export const createCourses = createAsyncThunk<Response<null>, NewCourse, { rejectValue: Response<null> }>(
    "course/createCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await createCourseAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCategories = createAsyncThunk<Response<Category[]>, null, { rejectValue: Response<null> }>(
    "course/getCategories",
    async (body, ThunkAPI) => {
        try {
            const response = await getCategoriesAPI();
            return response.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getMyCourses = createAsyncThunk<Response<PagingCourse>, GetMyCoursesType, { rejectValue: Response<null> }>(
    "course/getMyCourses",
    async (body, ThunkAPI) => {
        try {
            const response = await getMyCoursesAPI(body);
            return response.data as Response<PagingCourse>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCourseDetail = createAsyncThunk<Response<CourseDetailType>, string, { rejectValue: Response<null> }>(
    "course/getCourseDetail",
    async (body, ThunkAPI) => {
        try {
            const response = await getCourseDetailAPI(body);
            return response.data as Response<CourseDetailType>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const deleteCourse = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/deleteCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await deleteCourseAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: CourseSlice = {
    selectCategories: [],
    categories: [],
    courses: [],
    courseDetail:{
        id: undefined,
        slug: "",
        title: "",
        categories: [],
        summary: "",
        author: {
            id: undefined,
            first_name:"",
            last_name:"",
        },
        ratings: undefined,
        description: "",
        sections: [],
        created_at: "",
        updated_at: "",
        thumbnail:"",
        status:false
    },
    error: "",
    message: "",
    isLoading: false,
    totalPage: 1,
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
        setMessageEmpty: (state) => {
            state.error = "";
            state.message = "";
        },
        addCategories: (state, payload: PayloadAction<number>) => {
            const category = state.categories.splice(payload.payload, 1)[0];
            state.selectCategories.push(category);
        },
        removeCategories: (state, payload: PayloadAction<number>) => {
            const category: Category = state.selectCategories.splice(payload.payload, 1)[0];
            state.categories.push(category);
        },
        setCategories: (state, payload: PayloadAction<Category[]>) => {
            state.categories = payload.payload;
        },
        reset: (state) => {
            state.categories = [...state.categories, ...state.selectCategories];
            state.selectCategories = [];
        },
        setDeleteCourse: (state, action: PayloadAction<number>) => {
            state.courses = state.courses.filter((course: CourseType) => course.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createCourses.pending, (state) => {
            state.error = "";
            state.message = "";
            state.isLoading = true;
        });
        builder.addCase(createCourses.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(createCourses.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });

        builder.addCase(getCategories.pending, (state) => {
            state.error = "";
            state.message = "";
            state.isLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[];
            state.isLoading = false;
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });

        builder.addCase(getMyCourses.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getMyCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.courses as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isLoading = false;
        });

        builder.addCase(getMyCourses.rejected, (state, action) => {
            state.message = action.payload?.message as string;
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(deleteCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });

        builder.addCase(getCourseDetail.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getCourseDetail.fulfilled, (state, action) => {
            state.courseDetail = action.payload.data as CourseDetailType
            state.isLoading = false;
        });

        builder.addCase(getCourseDetail.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });
    },
});

export const { setError, setCategories, addCategories, removeCategories, reset, setDeleteCourse } = courseSlice.actions;

export default courseSlice.reducer;
