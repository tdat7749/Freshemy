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
// export class CourseDetailResponseData {
//     public id: number
//     public slug: string
//     public title: string
//     public categories: Category[]
//     public summary: string
//     public author: Author
//     public ratings: number
//     public thumbnail: string
//     public description: string
//     public sections: Section[]
//     public created_at: Date
//     public updated_at: Date

//     constructor(id:number, slug: string, title:string, categories: Category[], summary: string, author: Author, ratings: number, thumbnail: string, description: string, sections: Section[], created_at: Date, updated_at: Date){
//         this.id=id;
//         this.slug=slug;
//         this.title=title;
//         this.categories= categories;
//         this.summary= summary;
//         this.author= author;
//         this.ratings= ratings;
//         this.thumbnail= thumbnail;
//         this.description= description;
//         this.sections= sections;
//         this.created_at= created_at;
//         this.updated_at= updated_at;
//     }
//     public getCourseDetail(){
//         return
//         {
//             this.categories,
//             this.summary,
//             this.author,
//             this.ratings,
//             this.description,
//             this.sections,
//             this.created_at,
//             this.updated_at
//         }
//     }
// }
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

