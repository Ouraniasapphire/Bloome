import { supabase } from '~/clients/supabaseClient';
import type { Membership } from '~/types/Membership';

export class GetClassData {
    userID?: string;
    teacherID?: string;
    classID?: string;

    constructor({
        userID,
        teacherID,
        classID,
    }: {
        userID?: string;
        teacherID?: string;
        classID?: string;
    }) {
        this.userID = userID;
        this.teacherID = teacherID;
        this.classID = classID;
    }

    async getEnrollmentsByUserID() {

    }
}
