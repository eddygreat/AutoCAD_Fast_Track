import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// This is a webhook, we need to ensure Next.js does not cache it
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // 1. Get Paystack Secret Key & Supabase Service Role Key
        const secret = process.env.PAYSTACK_SECRET_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!secret || !supabaseUrl || !supabaseServiceKey) {
            console.error('Missing environment variables for webhook processing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 2. Read the raw body and signature
        const rawBody = await req.text();
        const signature = req.headers.get('x-paystack-signature');

        if (!signature) {
            console.error('No Paystack signature found');
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // 3. Verify Signature
        // Paystack creates an HMAC SHA512 signature using the secret key and the raw payload
        const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
        if (hash !== signature) {
            console.error('Invalid Paystack signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 4. Parse the verified event
        const event = JSON.parse(rawBody);

        // We only care about successful charges
        if (event.event === 'charge.success') {
            const data = event.data;
            const metadata = data.metadata;

            if (!metadata || !metadata.user_id || !metadata.tier) {
                console.error('Missing critical metadata in Paystack event:', event);
                return NextResponse.json({ status: 'ignored - missing metadata' }, { status: 200 });
            }

            const userId = metadata.user_id;
            const assignedTier = metadata.tier;

            // 5. Update the Database using the Supabase Service Role (Admin permission)
            // We use the service role key to bypass RLS policies safely from our secure backend
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({
                    has_paid: true,
                    plan_tier: assignedTier,
                })
                .eq('id', userId);

            if (updateError) {
                console.error('Database update failed:', updateError);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }

            console.log(`Successfully upgraded user ${userId} to ${assignedTier}`);
        }

        // 6. Return 200 OK to Paystack within 5 seconds to prevent retries
        return NextResponse.json({ status: 'success' }, { status: 200 });

    } catch (error) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
