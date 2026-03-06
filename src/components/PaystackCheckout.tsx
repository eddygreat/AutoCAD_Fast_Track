'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaystackCheckoutProps {
    tier: string;
    amount: number;
    email: string;
    buttonText?: string;
    className?: string;
}

export function PaystackCheckout({ tier, amount, email, buttonText = "Pay with Paystack", className }: PaystackCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handlePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/paystack/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tier,
                    amount,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to initialize payment');
            }

            // Redirect to Paystack's secure checkout page
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error('No authorization URL returned');
            }

        } catch (err: any) {
            console.error('Payment initialization failed:', err);
            setError(err.message || 'An error occurred while starting checkout.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <button
                onClick={handlePayment}
                disabled={isLoading}
                className={className || "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-200 active:scale-[0.98] text-lg disabled:opacity-70 disabled:cursor-not-allowed"}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <CreditCard className="w-5 h-5" />
                )}
                {isLoading ? 'Processing...' : buttonText}
            </button>

            {error && (
                <p className="text-red-500 dark:text-red-400 text-sm font-medium mt-2">{error}</p>
            )}
        </div>
    );
}
