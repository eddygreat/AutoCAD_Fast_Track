import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PaystackCheckout } from '@/components/PaystackCheckout';
import { GraduationCap } from 'lucide-react';

export const metadata = {
    title: 'Scholarship Checkout | CAD Fast Track',
};

export default async function ScholarshipCheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ tier: string; amount: string }>
}) {
    // 1. Verify Authentication
    const user = await getUserSession();
    if (!user) {
        redirect('/auth/login');
    }

    // 2. Extract and Validate Params
    const resolvedParams = await searchParams;
    const tier = resolvedParams?.tier;
    const customAmountStr = resolvedParams?.amount;

    if (!tier || !customAmountStr || isNaN(Number(customAmountStr))) {
        // If missing or invalid parameters, fall back to the standard dashboard which will handle normal pricing
        redirect('/dashboard');
    }

    const customAmount = Number(customAmountStr);

    // 3. Prevent users from paying if they are already paid or admin
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('users')
        .select('has_paid, role')
        .eq('id', user.id)
        .single();

    if (profile?.has_paid || profile?.role === 'admin') {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-center">

                {/* Header Graphic */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-10">
                        <GraduationCap className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Complete Enrollment</h2>
                        <p className="text-blue-100 mt-2 font-medium">Your scholarship has been applied!</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center text-sm mb-3">
                            <span className="text-zinc-500 font-medium">Selected Tier:</span>
                            <span className="font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">{tier}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-zinc-200 dark:border-zinc-800 pt-3">
                            <span className="text-zinc-500 font-medium">Discounted Price:</span>
                            <div className="text-right">
                                <span className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-50">${customAmount}</span>
                                <p className="text-xs text-zinc-500 font-medium">
                                    ≈ ₦{(customAmount * (Number(process.env.NEXT_PUBLIC_USD_TO_NGN_RATE) || 1400)).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Click the button below to complete your payment securely via Paystack. Your tier will be activated immediately.
                    </p>

                    <div className="pt-2">
                        <PaystackCheckout
                            tier={tier}
                            amount={customAmount}
                            email={user.email || ''}
                            buttonText={`Pay $${customAmount} Securely`}
                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/20 transition-all duration-300 active:scale-[0.98] text-lg disabled:opacity-70"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
