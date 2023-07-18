export type Category = {
    id: number,
    category: String
}

export type CreateCourse = {
    title: string,
    categories: Category[],
    status: number,
    summary: string,
    description: string,
    thumbnail: File | null
};



