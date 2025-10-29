import { supabase } from "~/lib/supabaseClient";

export default async function getStudents() {
    const { data: studentData, error: studentError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student');

    if (studentError) {
        console.error(studentError)
    }

    return studentData
}
