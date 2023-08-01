import { Author } from "./user.type";
import { Section } from "./section.type";

export type CourseDetail = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: Author;
    rating: number;
    thumbnail: string;
    description: string;
    sections: Section[];
    created_at: Date;
    updated_at: Date;
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
export type CourseInfo = {
    id: number;
    title: string;
    summary: string;
    thumbnail: string;
    rate: number;
    author: string;
    category: string[];
    number_section: number;
    slug: string;
};

export type CourseEdit = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    thumbnail: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type Category = {
    id: number;
    title?: string;
};

export type OutstandingCourse = {
    id: number;
    thumbnail: string;
    title: string;
    slug: string;
    categories: Category[];
    author: string;
    created_at: Date;
    updated_at: Date;
};
