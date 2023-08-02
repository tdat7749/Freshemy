import { Request } from "express";

export interface RequestHasLogin extends Request {
    user_id?: number;
}

export interface Course {
    [x: string]: any;
    id: number;
    title: string;
    slug: string;
    status: boolean;
    description: string;
    thumbnail: string;
    summary: string;
    is_delete: boolean;
    created_at: Date;
    updated_at: Date;

    user_id: number;
    user: User;

    enrolleds: Enrolled[];
    ratings: Rating[];
    sections: Section[];
    courses_categories: CourseCategory[];
}

export interface Rating {
    id: number;
    content: string;
    created_at: Date;

    user_id: number;
    user: User;

    course_id: number;
    course: Course;
}

export interface Section {
    id: number;
    title: string;
    is_delete: boolean;
    created_at: Date;
    updated_at: Date;

    course_id: number;
    course: Course;

    lessons: Lesson[];
}

export interface CourseCategory {
    id: number;
    created_at: Date;

    course_id: number;
    course: Course;

    category_id: number;
    category: Category;
}

// user.model.ts
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    description?: string;
    url_avatar?: string;
    created_at: Date;
    updated_at: Date;
    token?: string;
    is_verify: boolean;

    courses: Course[];
    enrolleds: Enrolled[];
    ratings: Rating[];
}

// course.model.ts
interface CourseInfo {
    id: number;
    title: string;
    summary: string;
    thumbnail: string;
    rate: number;
    author: string;
    category: string[];
    number_section: number;
    slug: string;
}

interface ResponseData {
    total_page: number;
    total_record: number;
    courses: CourseInfo[];
}

interface FilterAllCourseDetail {
    [x: string]: any;
    id: number;
    slug: string;
    thumbnail: string;
    author: {
        id: number;
        first_name: string;
        last_name: string;
    };
    rate: string;
    categories: {
        id: number;
        title: string;
    }[];
    title: string;
    summary: string;
    description: string;
    status: boolean;
    attendees: number;
    created_at: string; // Update this to be of type Date
    updated_at: string; // Update this to be of type Date
    ratings: {
        id: number;
        score: number;
        content: string;
        created_at: Date; // Update this to be of type Date
        user: {
            id: number;
            first_name: string;
            last_name: string;
        };
    }[];
}

