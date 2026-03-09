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

    // Validate the secret code again on the server side
    const SECRET_CODE = process.env.SCHOLARSHIP_SECRET_CODE || 'CAD-SCHOLAR-2026';

    if (code !== SECRET_CODE) {
        return redirect(`/enroll/scholarship?tier=${tier}&amount=${amount}&code=${code}&message=Invalid scholarship code`);
    }

    const data = {
        email,
        password,
        options: {
            data: {
                plan_tier: tier,
            }
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return redirect(`/enroll/scholarship?tier=${tier}&amount=${amount}&code=${code}&message=${error.message}`);
    }

    // Redirect to the custom checkout page for the scholarship discounted amount
    redirect(`/enroll/scholarship/checkout?tier=${tier}&amount=${amount}`);
}
