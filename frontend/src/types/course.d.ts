import { User } from "./user";

export type Category = {
    id: number;
    title: string;
};

export type NewCourse = {
    title: string;
    categories: number[];
    status: boolean;
    summary: string;
    description: string;
    thumbnail: string;
};

export type Course = {
    id: number;
    title: string;
    summary: string;
    rating: number;
    thumbnail: string;
    author?: User;
    categories: Category[];
    number_section: number;
    status: boolean;
    attendees: number;
    slug: string;
    author?: User;
    created_at: string;
};

export type GetMyCourses = {
    pageIndex: number;
    keyword?: string;
};

export type CreateCourse = {
    title: string;
    categories: Category[];
    status: string;
    summary: string;
    description: string;
};

export type DeleteCourse = {
    courseId: number;
};

export type PagingCourse = {
    total_page: number;
    total_record: number;
    data: Course[];
};

export type CourseDetail = {
    id: number | undefined;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: User;
    rating: number | undefined;
    description: string;
    sections: SectionRender[];
    created_at: string;
    updated_at: string;
    thumbnail: string;
    status: boolean;
};

export type RatingResponse = {
    id: number;
    ratings: number;
    content: string;
    created_at: string;
    url_avatar: string | null;
    first_name: string;
    last_name: string;
    user_id: number;
};

export type PagingRating = {
    total_page: number;
    total_record: number;
    data: RatingResponse[];
};

export type GetRating = {
    slug: string;
    page_index: number;
};

export type ChangeThumbnail = {
    course_id: number;
    thumbnail: File;
};

export type CourseChangeInformation = {
    course_id: number | undefined;
    title: string;
    summary: string;
    status: boolean;
    description: string;
    categories: Category[];
    slug: string;
    thumbnail?: string;
};

export type SelectCourse = {
    pageIndex: nunber;
    keyword?: string;
    category?: number[];
    rating?: number;
    sortBy?: string;
};

export type FilterCourse = {
    total_page: number;
    total_record: number;
    courses: Course[];
};

export type RatingCourse = {
    ratings: number;
    content: string;
    course_id: number;
};

export type EnrollCourse = {
    course_id: number;
};

export type GetRight = {
    role: string;
};
