export type Lesson = {
    order?: number;
    id: number;
    title: string;
    url_video: string;
};

export type orderLesson = {
    lessonId: number;
    newOrder?: number;
};

export type AddLesson = {
    order: number;
    section_id: string;
    title: string;
    video: File | null;
};

export type UpdateLesson = {
    id: number;
    title: string;
    video: File | null;
};
