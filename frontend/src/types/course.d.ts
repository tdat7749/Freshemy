import { User } from "./user";

export type Category = {
    id: number;
    title: string;
};

export type NewCourse = {
    title: string;
    categories: number[];
    status: number;
    summary: string;
    description: string;
    thumbnail: string;
};

export type Course = {
    id: number;
    title: string;
    summary: string;
    rate: number;
    thumbnail: string;
    author: string;
    categories: Category[];
    number_section: number;
    slug: string;
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
    courses: Course[];
};

export type CourseDetail = {
    id: number | undefined;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: User;
    ratings: Rating[];
    description: string;
    sections: SectionRender[];
    created_at: string;
    updated_at: string;
    thumbnail: string;
    status: boolean;
};

export type Rating = {
    id: number;
    score: number;
    content: string;
    created_at: Date;
    user_id: number;
    course_id: number;
    user: {
        first_name: string;
        last_name: string;
        url_avatar: string | null;
    };
};

export type ChangeThumbnail = {
    course_id: number;
    thumbnail: File;
};

export type CourseChangeInformation = {
    id: number | undefined;
    title: string;
    summary: string;
    status: boolean;
    description: string;
    categories: Category[];
    slug: string;
    thumbnail?: string;
};
