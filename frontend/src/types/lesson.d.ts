export type Lesson = {
    id: number;
    title: string;
    url_video: string;
    section_id: number;
};

export type AddLesson = {
    title: string;
    description: string;
    video: File | null;
};
