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
