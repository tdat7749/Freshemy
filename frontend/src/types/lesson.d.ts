export type Lesson = {
    order?: number;
    id: number;
    title: string;
    url_video: string;
};

export type orderLesson = {
    lesson_id: number;
    new_order?: number;
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

export type deteleLessonType = {
    id: number;
    course_id: number;
};
