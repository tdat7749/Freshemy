export type Lesson = {
    id: number;
    title: string;
    url_video: string;
};

export type AddLesson = {
    title: string;
    video: File | null;
};
