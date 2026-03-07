'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return redirect(`/auth/login?message=${error.message}`);
    }

    // Refresh navigation
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                plan_tier: formData.get('tier') as string,
            }
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return redirect(`/auth/register?message=${error.message}`);
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function requestPasswordReset(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    if (error) {
        return redirect(`/auth/forgot-password?message=${error.message}`);
    }

    return redirect(`/auth/forgot-password?success=Check your email for the reset link`);
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return redirect(`/auth/reset-password?message=${error.message}`);
    }

    // After resetting password, redirect to login
    redirect('/auth/login?message=Password updated successfully. Please log in.');
}
