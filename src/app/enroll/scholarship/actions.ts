'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function scholarshipSignup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const tier = formData.get('tier') as string;
    const amount = formData.get('amount') as string;
    const code = formData.get('code') as string;

    // Validate the dynamic secret code again on the server side
    const { getScholarshipSettings } = await import('@/app/dashboard/admin/actions');
    const settings = await getScholarshipSettings();

    if (!settings.scholarship_active) {
        return redirect(`/enroll?message=Scholarships are currently closed.`);
    }

    if (code !== settings.scholarship_code) {
        return redirect(`/enroll?message=Invalid or expired scholarship code.`);
    }

    const nextUrl = encodeURIComponent(`/enroll/scholarship/checkout?tier=${tier}&amount=${amount}`);
    const data = {
        email,
        password,
        options: {
            data: {
                plan_tier: tier,
                scholarship_amount: amount,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm?next=${nextUrl}`
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return redirect(`/enroll/scholarship?tier=${tier}&amount=${amount}&code=${code}&message=${error.message}`);
    }

    // Redirect to the custom checkout page for the scholarship discounted amount
    redirect(`/enroll/scholarship/checkout?tier=${tier}&amount=${amount}`);
}
