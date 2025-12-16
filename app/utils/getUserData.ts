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

        return [user_settings.preferred_name, user_settings.profile_color, user_settings.initials];
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
        // Fetch from users table
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', this.userID)
            .single();

        if (userError || !user) {
            throw new Error(`No data found for user id ${this.userID}, ${userError}`);
        }

        // Fetch from user_settings table
        const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('preferred_name')
            .eq('id', this.userID)
            .single();

        // Return preferred_name if it exists, otherwise fallback to empty string
        const preferredName = settingsError || !settings ? '' : settings.preferred_name;

        return [user.name, preferredName];
    }
}
