import { User } from "./user";

export type Category = {
    id: number;
    title: String;
};

export type NewCourse = {
    title: string;
    categories: string;
    status: number;
    summary: string;
    description: string;
    thumbnail: File | null;
};

export type Course = {
    id: number;
    title: string;
    summary: string;
    rate: number;
    thumbnail: string;
    author: string;
    category: string[];
    number_section: number;
    slug: string;
};

export type getMyCourses = {
    pageIndex: number;
    keyword?: string;
};

export type GetCourseInfo = {
    courses: Course[];
};

export type CreateCourse = {
    title: string;
    categories: Category[];
    status: string;
    summary: string;
    description: string;
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
    ratings: number | undefined;
    description: string;
    sections: SectionRender[];
    created_at: string;
    updated_at: string;
    thumbnail:string
    status:boolean
};
