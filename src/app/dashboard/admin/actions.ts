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

/**
 * Manually deletes a user from the authentication system and database.
 * Only callable by admins.
 */
export async function deleteUser(userId: string) {
    try {
        // 1. Verify the caller is an admin
        await requireAdmin();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase credentials for Admin API');
        }

        const { createClient: createAdminClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // 2. Safety Check: Verify the target is NOT another admin
        const { data: targetUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('role, email')
            .eq('id', userId)
            .single();

        if (fetchError || !targetUser) {
            throw new Error('User not found.');
        }

        if (targetUser.role === 'admin') {
            throw new Error('Cannot delete an admin user.');
        }

        // 3. Delete from public.users manually
        const { error: dbDeleteError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId);

        if (dbDeleteError) {
            console.error('Failed to delete user profile from db:', dbDeleteError);
            return { error: 'Failed to delete user from database.' };
        }

        // 4. Delete from Supabase Auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error('Failed to delete user from auth:', deleteError);
            return { error: 'Failed to delete user secure identity.' };
        }

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error: any) {
        console.error('Admin Delete Action Error:', error);
        return { error: error.message || 'An unknown error occurred during deletion.' };
    }
}

/**
 * Revokes a user's access (sets has_paid to false).
 * Useful for refunds or temporary blocks.
 */
export async function revokeUserAccess(userId: string) {
    try {
        await requireAdmin();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase credentials for Admin API');
        }

        const { createClient: createAdminClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ has_paid: false })
            .eq('id', userId);

        if (updateError) {
            console.error('Failed to revoke access:', updateError);
            return { error: 'Failed to update user access status' };
        }

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error: any) {
        console.error('Admin Revoke Action Error:', error);
        return { error: error.message || 'An unknown error occurred while revoking access' };
    }
}

/**
 * Gets the current scholarship settings (active status and secret code).
 */
export async function getScholarshipSettings() {
    try {
        await requireAdmin();
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('app_settings')
            .select('scholarship_active, scholarship_code, issuer_name, issuer_title, issuer_signature_url')
            .eq('id', 1)
            .single();

        if (error || !data) {
            // Fallback gracefully if table isn't seeded correctly yet
            return { 
                scholarship_active: false, 
                scholarship_code: 'CAD-SCHOLAR-2026',
                issuer_name: 'Edward Manasseh',
                issuer_title: 'Lead Instructor, CAD Fast Track',
                issuer_signature_url: ''
            };
        }
        return data;
    } catch (error) {
        return { 
            scholarship_active: false, 
            scholarship_code: 'CAD-SCHOLAR-2026',
            issuer_name: 'Edward Manasseh',
            issuer_title: 'Lead Instructor, CAD Fast Track',
            issuer_signature_url: ''
        };
    }
}

/**
 * Updates the certificate settings (signature, issuer name, etc).
 */
export async function updateCertificateSettings(settings: { 
    issuer_name: string, 
    issuer_title: string, 
    issuer_signature_url: string 
}) {
    try {
        await requireAdmin();
        const supabase = await createClient();

        const { error } = await supabase
            .from('app_settings')
            .update(settings)
            .eq('id', 1);

        if (error) {
            console.error('Failed to update certificate settings:', error);
            // If the error is "column does not exist", we might need to inform the user
            // but for now we'll just return the error.
            return { error: 'Failed to update settings. Please ensure DB columns exist.' };
        }

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error: any) {
        console.error('Admin Certificate Settings Action Error:', error);
        return { error: error.message || 'An unknown error occurred' };
    }
}

/**
 * Toggles the scholarship status. If turning ON, it rotates the secret code to invalidate old links.
 */
export async function toggleScholarship(active: boolean) {
    try {
        await requireAdmin();
        const supabase = await createClient();

        let updateData: { scholarship_active: boolean, scholarship_code?: string } = { scholarship_active: active };

        // If turning it on, generate a new random code
        if (active) {
            updateData.scholarship_code = `CS-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        }

        const { error } = await supabase
            .from('app_settings')
            .update(updateData)
            .eq('id', 1);

        if (error) throw error;

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to toggle scholarship:', error);
        return { error: 'Failed to update scholarship settings' };
    }
}
