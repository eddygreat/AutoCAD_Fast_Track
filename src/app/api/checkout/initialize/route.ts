import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

// Define the tier hierarchy and pricing
const TIER_PRICING = {
    basic: { price: 29.99, rank: 1, name: 'Basic' },
    silver: { price: 49.99, rank: 2, name: 'Silver' },
    premium: { price: 99.99, rank: 3, name: 'Premium' },
    gold: { price: 199.99, rank: 4, name: 'Gold Premium' },
} as const;

type TierKey = keyof typeof TIER_PRICING;

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

        // 2. Validate Pricing Server-Side
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        let expectedAmount = 0;
        const targetTierDetails = TIER_PRICING[tier as TierKey];
        
        if (!targetTierDetails) {
             return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
        }

        if (profile?.has_paid) {
            // Upgrade Scenario
            const currentTierDetails = TIER_PRICING[(profile.plan_tier as TierKey) || 'basic'];
            if (targetTierDetails.rank <= currentTierDetails.rank) {
                return NextResponse.json({ error: 'Cannot upgrade to a lower or equal tier' }, { status: 400 });
            }
            const difference = targetTierDetails.price - currentTierDetails.price;
            expectedAmount = Math.round(difference * 100) / 100;
        } else {
            // New Enrollment Scenario
            const scholarshipAmountStr = user.user_metadata?.scholarship_amount;
            if (scholarshipAmountStr && !isNaN(Number(scholarshipAmountStr))) {
                expectedAmount = Number(scholarshipAmountStr);
            } else {
                expectedAmount = targetTierDetails.price;
            }
        }

        // Ensure the client isn't trying to bypass pricing
        if (Math.abs(amount - expectedAmount) > 0.02) {
            console.error(`[Security Warning] Pricing bypass attempt detected! Client sent $${amount}, Server expected $${expectedAmount}`);
            return NextResponse.json({ error: 'Invalid payment amount detected' }, { status: 400 });
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
                // Redirect user to our verification route after successful payment
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/verify`,            }),
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
