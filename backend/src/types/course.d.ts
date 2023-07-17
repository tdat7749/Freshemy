import { Category } from "./category";

export type CreateCourse = {
    title: string;
    description: string;
    slug: string;
    status: boolean;
    summary: string;
    thumbnail: string;
    categories: Category[];
};
