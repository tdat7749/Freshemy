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
export type Author = {
    first_name: string;
    last_name: string;
    id: number;
};
export type Lesson = {
    id: number;
    title: string;
    url_video: string;
};
export type Section = {
    title: string;
    updated_at: Date;
    id: number;
    lessons: Lesson[];
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

export type AllCourseDetail = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: Author;
    ratings: {
        id: number;
        score: number;
        content: string;
        created_at: Date;
        user: {
            id: number;
            first_name: string;
            last_name: string;
        };
    }[];
    attendees: number;
    thumbnail: string;
    description: string;
    sections: Section[];
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type FilteredCourseResult = {
    courses: AllCourseDetail[];
    total_page: number;
    total_record: number;
};

export type CourseOrderByWithRelationInput = {
    [x: string]: { _count: string; };
    created_at?: "asc" | "desc";
    ratings?: {
        _count?: "asc" | "desc";
    };
};
