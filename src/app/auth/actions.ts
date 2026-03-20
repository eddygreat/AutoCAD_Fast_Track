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

    const email = (formData.get('email') as string)?.trim();
    const tier = (formData.get('tier') as string || 'basic').toLowerCase().trim();
    const phone = (formData.get('phone') as string)?.trim();

    console.log('--- SIGNUP ATTEMPT ---');
    console.log('Email:', email);
    console.log('Tier:', tier);
    console.log('Phone:', phone);

    const data = {
        email: email,
        password: formData.get('password') as string,
        options: {
            data: {
                plan_tier: tier,
                phone: phone,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.error('SIGNUP ERROR:', error);
        return redirect(`/auth/register?message=${error.message}`);
    }

    revalidatePath('/', 'layout');
    redirect('/auth/login?message=Registration successful! Kindly login to proceed.');
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/');
}

export async function requestPasswordReset(formData: FormData) {
    try {
        const supabase = await createClient();
        const email = (formData.get('email') as string)?.trim();
        const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`;

        console.log('--- PASSWORD RESET ATTEMPT ---');
        console.log('Email:', email);
        console.log('Redirect URL:', redirectTo);
        console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm?next=/auth/reset-password`,
        });

        if (error) {
            console.error('SUPABASE ERROR:', error);
            return redirect(`/auth/forgot-password?message=${error.message}`);
        }

        console.log('Password reset link sent successfully');
        return redirect(`/auth/forgot-password?success=Check your email for the reset link`);
    } catch (err) {
        // Ignore NEXT_REDIRECT errors as they are expected behavior for redirect()
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
            throw err;
        }
        console.error('UNEXPECTED EXCEPTION:', err);
        return redirect(`/auth/forgot-password?message=An unexpected error occurred. Please check server logs.`);
    }
}

export async function resetPassword(formData: FormData) {
    try {
        const supabase = await createClient();
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            console.error('PASSWORD UPDATE ERROR:', error);
            return redirect(`/auth/reset-password?message=${error.message}`);
        }

        // After resetting password, redirect to login or dashboard
        // Usually, the user is now logged in, so dashboard is better
        return redirect('/dashboard?message=Password updated successfully!');
    } catch (err) {
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
            throw err;
        }
        console.error('RESET PASSWORD EXCEPTION:', err);
        return redirect(`/auth/reset-password?message=An unexpected error occurred`);
    }
}
