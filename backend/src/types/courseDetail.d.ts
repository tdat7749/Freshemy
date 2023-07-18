export type CourseDetailResponseData = {
        id: number
        slug: string
        title: string
        categories: Category[]
        summary: string
        author: Author
        ratings: number
        thumbnail: string
        description: string
        sections: Section[]
        created_at: Date
        updated_at: Date
}

export type Category = {
    id: number,
    title: string,
}
export type Author = {
    first_name: string,
    last_name: string,
    id: number,
}
export type Lesson = {
    title: string
    url_video: string
    
}
export type Section = {
    title: string,
    updated_at: Date,
    lessions: Lesson[],
}

