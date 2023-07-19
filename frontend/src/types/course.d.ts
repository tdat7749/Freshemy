export type Category = {
    id: number,
    category: String
}

export type NewCourse = {
    title: string,
    categories: Category[],
    status: number,
    summary: string,
    description: string,
    thumbnail: File | null
};



