import { User } from "./user";

export type Class = {
    id: string;
    name: string;
    section?: string;
    description?: string;
    hero_url: any;
    teacher_id?: string;
    teacher_name?: string;
    teacher_initials?: string;
    room?: string;
    enrolled_students?: User[];
};
