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

export type CourseInfo = {
    id: number;
    title: string;
    summary: string;
    thumbnail: string;
    rating: number;
    author: Author;
    category: string[];
    number_section: number;
    slug: string;
    attendees: number;
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
    author: Author;
    created_at: Date;
    updated_at: Date;
};

export type CourseCard = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: Author;
    rating: number;
    attendees: number;
    number_section: number;
    thumbnail: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type CourseOrderByWithRelationInput = {
    [x: string]: "asc" | "desc" | { _count?: "asc" | "desc" } | undefined;
    created_at?: "asc" | "desc" | undefined;
    ratings?: { _count?: "asc" | "desc" } | undefined;
    enrolleds?: { _count?: "asc" | "desc" } | undefined;
    sections?: { _count?: "asc" | "desc" } | undefined;
};
