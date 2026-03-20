import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/dashboard';

    let redirectUrl = `/auth/verified`;
    if (next && next !== '/dashboard') {
        // If the next page is reset-password, skip the 'verified' success screen
        if (next === '/auth/reset-password') {
            redirectUrl = next;
        } else {
            redirectUrl += `?next=${encodeURIComponent(next)}`;
        }
    }

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });
        if (!error) {
            redirect(redirectUrl);
        }
    } else if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            redirect(redirectUrl);
        }
    }

    // If there is an error or it's an unrecognized format, send them to login with an error
    redirect('/auth/login?message=Email verification failed or link expired. Please try logging in or registering again.');
}
