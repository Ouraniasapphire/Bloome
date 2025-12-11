import { supabase } from '~/clients/supabaseClient';

export class GetUserData {
    userID: string;


    // Constructor for class
    constructor({ userID }: { userID: string }) {
        this.userID = userID;
    }

    // Get Dynamic Key
    async getDynamicKey() {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.userID)
            .single();

        if (error || !user) {
            throw new Error(`No data found for user id ${this.userID}, ${error}`);
        }

        return user.dynamic_key;
    }

    // Get Users Settings
    async getUserSettings() {
        const { data: user_settings, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('id', this.userID)
            .single();

        if (error || !user_settings) {
            throw new Error(`No user settings found for id ${this.userID}, ${error}`);
        }

        return [user_settings.preferred_name, user_settings.profile_color];
    }

    // Get user role
    async getUserRole() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.userID)
            .single();

        if (error) {
            throw new Error(`No data found for user id ${this.userID}, ${error}`);
        }

        return data.role;
    }

    // Get users name
    async getUserName() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.userID)
            .single();

        if (error) {
            throw new Error(`No data found for user id ${this.userID}, ${error}`);
        }

        return data.name;
    }
}
