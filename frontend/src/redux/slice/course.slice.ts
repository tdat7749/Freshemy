import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";

import {
    createCourse as createCourseAPI,
    getCategories as getCategoriesAPI,
    getMyCourses as getMyCoursesAPI,
    deleteCourse as deleteCourseAPI,
    getCourseDetail as getCourseDetailAPI,
    getCourseDetailById as getCourseDetailByIdAPI,
    changeThumbnail as changeThumbnailAPI,
    changeInformation as changeInformationAPI
} from "../../apis/course";

import {
    NewCourse,
    Category,
    Course,
    Course as CourseType,
    PagingCourse,
    GetMyCourses as GetMyCoursesType,
    CourseDetail as CourseDetailType,
    ChangeThumbnail as ChangeThumbnailType,
    ChangeInformation as ChangeInformationType
} from "../../types/course";

import { AddSection as AddSectionType,Section as SectionType } from "../../types/section";

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
            return response.data.data as Response<Category[]>;
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

export const getCourseDetailById = createAsyncThunk<Response<CourseDetailType>, number, { rejectValue: Response<null> }>(
    "course/getCourseDetailById",
    async (body, ThunkAPI) => {
        try {
            const response = await getCourseDetailByIdAPI(body);
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

export const changeThumbnail = createAsyncThunk<Response<null>, ChangeThumbnailType, { rejectValue: Response<null> }>(
    "course/changeThumbnail",
    async (body, ThunkAPI) => {
        try {
            const response = await changeThumbnailAPI(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);


export const changeInformation = createAsyncThunk<Response<null>, ChangeInformationType, { rejectValue: Response<null> }>(
    "course/changeInformation",
    async (body, ThunkAPI) => {
        try {
            const response = await changeInformationAPI(body);
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
        addSection:(state,action:PayloadAction<AddSectionType>) =>{
            state.courseDetail.sections = [...state.courseDetail.sections,action.payload]
        },
        setEditSection: (state, action: PayloadAction<SectionType>) => {
            state.courseDetail.sections = state.courseDetail.sections.map((section: SectionType) => {
                if (section.id === action.payload.id) {
                    section.title = action.payload.title;
                }
                return section;
            });
        },
        setDeleteSection: (state, action: PayloadAction<number>) => {
            state.courseDetail.sections = state.courseDetail.sections.filter((section: SectionType) => section.id !== action.payload);
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
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[];
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = action.payload?.message as string;
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

        builder.addCase(getCourseDetailById.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getCourseDetailById.fulfilled, (state, action) => {
            state.courseDetail = action.payload.data as CourseDetailType
            state.selectCategories = action.payload.data?.categories as Category[]
            
            state.selectCategories.forEach(category => {
                const index = state.categories.findIndex(item => item === category);
                state.categories.splice(index, 1);
            })
            state.isLoading = false;
        });

        builder.addCase(getCourseDetailById.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });

        builder.addCase(changeThumbnail.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(changeThumbnail.fulfilled, (state, action) => {
            state.message = action.payload.message
            state.isLoading = false;
        });

        builder.addCase(changeThumbnail.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });


        builder.addCase(changeInformation.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(changeInformation.fulfilled, (state, action) => {
            state.message = action.payload.message
            state.isLoading = false;
        });

        builder.addCase(changeInformation.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });
    },
});

export const { setError, setCategories, addCategories, removeCategories, reset, setDeleteCourse,addSection,setEditSection,setDeleteSection } = courseSlice.actions;

export default courseSlice.reducer;