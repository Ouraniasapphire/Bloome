import { User } from "./user";

export type Class = {
    id: string;
    name: string;
    section?: string;
    description?: string;
    teacher_id?: string;
    teacher_name?: string;
    teacher_initials?: string;
    enrolled_students?: User[];
};
