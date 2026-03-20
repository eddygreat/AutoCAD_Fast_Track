import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

// Types for the request body
interface InitiatizePaymentRequest {
    tier: string;
    amount: number;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: InitiatizePaymentRequest = await req.json();
        const { tier, amount } = body;

        if (!tier || !amount) {
            return NextResponse.json({ error: 'Missing tier or amount' }, { status: 400 });
        }

        // 2. Prepare Paystack Initialize Payload
        // Convert dollar amount to Naira subunits (Kobo)
        const exchangeRate = Number(process.env.NEXT_PUBLIC_USD_TO_NGN_RATE) || 1400;
        const amountInNaira = amount * exchangeRate;
        const amountInKobo = Math.round(amountInNaira * 100);

        // Generate a secure, unique reference for this specific transaction attempt
        const reference = `cad_ft_${crypto.randomBytes(8).toString('hex')}`;

        // 3. Optional: Store the pending transaction in your database here if you want to track aborted checkouts
        // ...

        // 4. Call Paystack API
        const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackSecret) {
            console.error('PAYSTACK_SECRET_KEY is not defined in environment variables');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                amount: amountInKobo,
                currency: 'NGN',
                reference: reference,
                metadata: {
                    user_id: user.id,
                    tier: tier,
                },
                channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
                // Optional: redirect URL if you don't use the popup
                // callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, 
            }),
        });

        const paystackData = await response.json();

        if (!response.ok || !paystackData.status) {
            console.error('Paystack API Error:', paystackData);
            return NextResponse.json(
                { error: 'Failed to initialize payment with Paystack' },
                { status: 500 }
            );
        }

        // 5. Return the Authorization URL and Access Code
        return NextResponse.json({
            authorization_url: paystackData.data.authorization_url,
            access_code: paystackData.data.access_code,
            reference: paystackData.data.reference,
        });

    } catch (error) {
        console.error('Payment initialization error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
