export type Lesson = {
    id: number;
    title: string;
    url_video: string;
};

export type AddLesson = {
    section_id:string;
    title: string;
    video: File | null;
};
