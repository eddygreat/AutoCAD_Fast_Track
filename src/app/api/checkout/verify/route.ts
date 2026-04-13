import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.redirect(new URL('/dashboard?error=no_reference', req.url));
        }

        // 1. Get Environment Variables
        const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!paystackSecret || !supabaseUrl || !supabaseServiceKey) {
            console.error('Missing environment variables for verification');
            return NextResponse.redirect(new URL('/dashboard?error=server_error', req.url));
        }

        // 2. Verify Transaction with Paystack
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
            },
        });

        const paystackData = await response.json();

        if (!response.ok || !paystackData.status || paystackData.data.status !== 'success') {
            console.error('Paystack Verification Failed:', paystackData);
            return NextResponse.redirect(new URL('/dashboard?error=payment_failed', req.url));
        }

        const data = paystackData.data;
        const metadata = data.metadata;

        if (!metadata || !metadata.user_id || !metadata.tier) {
            console.error('Missing critical metadata in Paystack verification:', data);
            return NextResponse.redirect(new URL('/dashboard?error=missing_metadata', req.url));
        }

        const userId = metadata.user_id;
        const assignedTier = metadata.tier;

        console.log(`[Verification] Processing successful payment for User: ${userId}, Tier: ${assignedTier}`);

        // 3. Update the Database using Supabase Admin Client (Service Role)
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                has_paid: true,
                plan_tier: assignedTier,
            })
            .eq('id', userId);

        if (updateError) {
            console.error('[Verification] Database update failed:', updateError);
            return NextResponse.redirect(new URL('/dashboard?error=database_error', req.url));
        }

        console.log(`[Verification] Successfully upgraded user ${userId} to ${assignedTier}`);

        // 4. Clear Cache for Dashboard
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/admin');

        // 5. Success! Redirect to Day 1
        return NextResponse.redirect(new URL('/dashboard/lessons/1', req.url));

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.redirect(new URL('/dashboard?error=internal_error', req.url));
    }
}
