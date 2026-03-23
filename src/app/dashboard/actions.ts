'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSession } from '@/app/auth/session';
import { revalidatePath } from 'next/cache';

export async function markLessonComplete(lessonId: string, score: number) {
    const user = await getUserSession();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const supabase = await createClient();

    // Upsert the progress record
    const { error } = await supabase
        .from('user_progress')
        .upsert(
            {
                user_id: user.id,
                lesson_id: lessonId,
                quiz_score: score,
                is_completed: score >= 80,
            },
            { onConflict: 'user_id,lesson_id' }
        );

    if (error) {
        console.error('Error saving progress:', error);
        throw new Error('Failed to save progress');
    }

    // Revalidate to trigger a fresh data pull on the dashboard
    revalidatePath('/dashboard', 'layout');

    return { success: true };
}

/**
 * Updates the user's full name (for certificate issuing).
 */
export async function updateUserName(fullName: string) {
    const user = await getUserSession();
    if (!user) throw new Error('Unauthorized');

    const supabase = await createClient();

    const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating user name:', error);
        return { error: 'Failed to update name' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
