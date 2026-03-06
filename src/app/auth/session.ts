'use server';

import { createClient } from '@/utils/supabase/server';

export async function getUserSession() {
    const supabase = await createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        return null;
    }
}
