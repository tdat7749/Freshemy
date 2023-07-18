export interface CreateCourseDTO {
    title: string;
    slug: string;
    status: boolean;
    description: string;
    summary: string;
    categories: number[];
}
