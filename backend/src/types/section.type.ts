import { Lesson } from "./lession.type";

export type Section = {
    title: string;
    updated_at: Date;
    id: number;
    lessons: Lesson[];
};
