import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";

import {
    NewCourse,
    Category,
    Course,
    Course as CourseType,
    PagingCourse,
    GetMyCourses as GetMyCoursesType,
    CourseDetail as CourseDetailType,
    ChangeThumbnail as ChangeThumbnailType,
    CourseChangeInformation as CourseChangeInformationType,
    SelectCourse,
    FilterCourse,
    RatingCourse as RatingCourseType,
    RatingResponse as RatingResponseType,
    EnrollCourse as EnrollCourseType,
    GetRating as GetRatingType,
    PagingRating,
    GetRight as GetRightType,
} from "../../types/course";

import { CourseApis } from "@src/apis";

type CourseSlice = {
    selectCategories: Category[];
    categories: Category[];
    courses: CourseType[];
    isLoading: boolean;
    isGetLoading: boolean;
    totalPage: number;
    totalRecord: number;
    courseDetail: CourseDetailType;
    courseChangeDetail: CourseChangeInformationType;
    ratings: RatingResponseType[];
    totalRatingPage: number;
    role: string;
};

export const createCourses = createAsyncThunk<Response<null>, NewCourse, { rejectValue: Response<null> }>(
    "course/createCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.createCourse(body);
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
            const response = await CourseApis.getCategories();
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
            const response = await CourseApis.getMyCourses(body);
            return response.data as Response<PagingCourse>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getEnrolledCourses = createAsyncThunk<Response<PagingCourse>, GetMyCoursesType, { rejectValue: Response<null> }>(
    "course/getEnrolledCourses",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getEnrolledCourses(body);
            console.log(response)
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
            const response = await CourseApis.getCourseDetail(body);
            return response.data as Response<CourseDetailType>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCourseDetailById = createAsyncThunk<
    Response<CourseChangeInformationType>,
    number,
    { rejectValue: Response<null> }
>("course/getCourseDetailById", async (body, ThunkAPI) => {
    try {
        const response = await CourseApis.getCourseDetailById(body);
        return response.data as Response<CourseChangeInformationType>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const deleteCourse = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/deleteCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.deleteCourse(body);
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
            const response = await CourseApis.changeThumbnail(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const selectCourses = createAsyncThunk<Response<FilterCourse>, SelectCourse, { rejectValue: Response<null> }>(
    "course/selectCourses",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.selectCourses(body);
            return response.data as Response<FilterCourse>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const changeInformation = createAsyncThunk<
    Response<null>,
    CourseChangeInformationType,
    { rejectValue: Response<null> }
>("course/changeInformation", async (body, ThunkAPI) => {
    try {
        const response = await CourseApis.changeInformation(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const getTop10Courses = createAsyncThunk<Response<CourseType[]>, string, { rejectValue: Response<null> }>(
    "course/getTop10Courses",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getTop10Courses();
            return response.data as Response<CourseType[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const ratingCourse = createAsyncThunk<Response<null>, RatingCourseType, { rejectValue: Response<null> }>(
    "course/rating",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.ratingCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);
export const subscribeCourse = createAsyncThunk<Response<null>, EnrollCourseType, { rejectValue: Response<null> }>(
    "course/registration",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.subscribeCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);
export const unsubcribeCourse = createAsyncThunk<Response<null>, EnrollCourseType, { rejectValue: Response<null> }>(
    "course/unsubscribe",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.unsubcribeCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);
export const getRightOfCourse = createAsyncThunk<Response<GetRightType>, number, { rejectValue: Response<null> }>(
    "course/right",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getRightOfCourse(body);
            return response.data as Response<GetRightType>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getListRatingsOfCourseBySlug = createAsyncThunk<
    Response<PagingRating>,
    GetRatingType,
    { rejectValue: Response<null> }
>("course/getListRatingsOfCourseBySlug", async (body, ThunkAPI) => {
    try {
        const response = await CourseApis.getListRatingsOfCourseBySlug(body);
        return response.data as Response<PagingRating>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

const initialState: CourseSlice = {
    selectCategories: [],
    categories: [],
    courses: [],
    courseDetail: {
        id: undefined,
        slug: "",
        title: "",
        categories: [],
        summary: "",
        author: {
            email: "",
            id: 0,
            first_name: "",
            last_name: "",
        },
        rating: undefined,
        description: "",
        sections: [],
        created_at: "",
        updated_at: "",
        thumbnail: "",
        status: false,
    },
    courseChangeDetail: {
        course_id: undefined,
        slug: "",
        title: "",
        categories: [],
        summary: "",
        status: false,
        description: "",
        thumbnail: "",
    },
    isLoading: false,
    totalPage: 1,
    totalRecord: 0,
    isGetLoading: false,
    ratings: [],
    totalRatingPage: 1,
    role: "",
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
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
            state.isLoading = true;
        });
        builder.addCase(createCourses.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createCourses.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[];
            state.isLoading = false;
        });
        builder.addCase(getCategories.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getMyCourses.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getMyCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.data as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isGetLoading = false;
        });

        builder.addCase(getMyCourses.rejected, (state, action) => {
            state.isGetLoading = false;
        });

        builder.addCase(getEnrolledCourses.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getEnrolledCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.data as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isGetLoading = false;
        });

        builder.addCase(getEnrolledCourses.rejected, (state, action) => {
            state.isGetLoading = false;
        });

        builder.addCase(deleteCourse.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(deleteCourse.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.rejected, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(getCourseDetail.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getCourseDetail.fulfilled, (state, action) => {
            state.courseDetail = action.payload.data as CourseDetailType;
            state.isGetLoading = false;
        });

        builder.addCase(getCourseDetail.rejected, (state) => {
            state.isGetLoading = false;
        });

        builder.addCase(getCourseDetailById.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getCourseDetailById.fulfilled, (state, action) => {
            state.courseChangeDetail = action.payload.data as CourseChangeInformationType;
            state.selectCategories = action.payload.data?.categories as Category[];
            state.isGetLoading = false;
        });

        builder.addCase(getCourseDetailById.rejected, (state) => {
            state.isGetLoading = false;
        });

        builder.addCase(changeThumbnail.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(changeThumbnail.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(changeThumbnail.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(changeInformation.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(changeInformation.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(changeInformation.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getTop10Courses.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getTop10Courses.fulfilled, (state, action) => {
            state.courses = action.payload.data as Course[];
            state.isGetLoading = false;
        });

        builder.addCase(getTop10Courses.rejected, (state) => {
            state.isGetLoading = false;
        });

        builder.addCase(selectCourses.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(selectCourses.fulfilled, (state, action) => {
            console.log(action.payload.data);
            state.courses = action.payload.data?.courses as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isGetLoading = false;
        });

        builder.addCase(selectCourses.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(getRightOfCourse.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getRightOfCourse.fulfilled, (state, action) => {
            state.role = action.payload.data?.role as string;
            state.isGetLoading = false;
        });

        builder.addCase(getRightOfCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(ratingCourse.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(ratingCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(ratingCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(subscribeCourse.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(subscribeCourse.fulfilled, (state) => {
            state.role = "Enrolled";
            state.isLoading = false;
        });

        builder.addCase(subscribeCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(unsubcribeCourse.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(unsubcribeCourse.fulfilled, (state) => {
            state.role = "Unenrolled";
            state.isLoading = false;
        });

        builder.addCase(unsubcribeCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getListRatingsOfCourseBySlug.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getListRatingsOfCourseBySlug.fulfilled, (state, action) => {
            state.ratings = action.payload.data?.data as RatingResponseType[];

            state.totalRatingPage = action.payload.data?.total_page as number;
            state.isGetLoading = false;
        });

        builder.addCase(getListRatingsOfCourseBySlug.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const { setCategories, reset, setDeleteCourse } = courseSlice.actions;

export default courseSlice.reducer;
