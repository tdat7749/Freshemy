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

export type deleteCourse = {
    courseId: number;
};

export type Category = {
    id: number;
    category: String;
};

export type PagingCourse = {
    total_page: number;
    total_record: number;
    courses: Course[];
};
