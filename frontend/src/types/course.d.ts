export type Category = {
    id: number, 
    category: String
}

export type CreateCourse = {
    title: string,
    categories: Category[],
    status: string,
    summary: string,
    description: string,
};



