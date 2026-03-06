'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSession } from '@/app/auth/session';
import { revalidatePath } from 'next/cache';

/**
 * Ensures the currently logged-in user is actually an admin in the database.
 * Returns the admin user's profile if true, throws an error if not.
 */
async function requireAdmin() {
    const user = await getUserSession();
    if (!user) throw new Error('Not authenticated');

    const supabase = await createClient();
    const { data: profile, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || profile?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
    }

    return profile;
}

/**
 * Manually upgrades a user's account to paid access with a specific tier.
 * Only callable by admins.
 */
export async function authorizeUser(userId: string, tier: string) {
    try {
        // 1. Verify the caller is an admin
        await requireAdmin();

        // 2. Use the Service Role Key to bypass RLS and perform the secure update
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase credentials for Admin API');
        }

        const { createClient: createAdminClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                has_paid: true,
                plan_tier: tier
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Failed to authorize user:', updateError);
            return { error: 'Database update failed' };
        }

        // 3. Clear the Next.js cache so the admin table immediately shows the new status
        revalidatePath('/dashboard/admin');

        return { success: true };
    } catch (error: any) {
        console.error('Admin Auth Action Error:', error);
        return { error: error.message || 'An unknown error occurred' };
    }
}
