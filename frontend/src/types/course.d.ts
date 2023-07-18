export type Course = {
    id: number;
    title: string;
    summary: string;
    rate: number;
    author: string;
    category: string[];
    number_section: number;
    slug: string;
};

export type getMyCourses = {
    pageIndex: number;
    keyword: string;
};
