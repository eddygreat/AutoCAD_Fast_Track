import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PaystackCheckout } from '@/components/PaystackCheckout';
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Upgrade Plan | CAD Fast Track',
};

// Define the tier hierarchy and pricing
const TIER_PRICING = {
    basic: { price: 29.99, rank: 1, name: 'Basic' },
    silver: { price: 49.99, rank: 2, name: 'Silver' },
    premium: { price: 99.99, rank: 3, name: 'Premium' },
    gold: { price: 199.99, rank: 4, name: 'Gold Premium' },
} as const;

type TierKey = keyof typeof TIER_PRICING;

export default async function UpgradePage({
    searchParams,
}: {
    searchParams: Promise<{ target?: string }>
}) {
    // 1. Verify Authentication
    const user = await getUserSession();
    if (!user) {
        redirect('/auth/login');
    }

    // 2. Fetch User Profile
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // If not paid at all, they shouldn't even be on the upgrade page, they should be on the dashboard paying their base price
    if (!profile?.has_paid && profile?.role !== 'admin') {
        redirect('/dashboard');
    }

    const currentTierKey = (profile?.plan_tier as TierKey) || 'basic';
    const currentTierDetails = TIER_PRICING[currentTierKey];

    // If they somehow have an invalid tier or are already at the max tier
    if (!currentTierDetails || currentTierDetails.rank === 4) {
        return (
            <div className="min-h-[calc(100vh-5rem)] py-12 bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="inline-flex p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">You have the highest plan!</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                        You are currently on the {TIER_PRICING.gold.name} tier, which includes all our premium features. No further upgrades are available.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Calculate Upgrade Options
    // Filter tiers to only those with a higher rank than the current tier
    const upgradeOptions = (Object.entries(TIER_PRICING) as [TierKey, typeof TIER_PRICING[TierKey]][])
        .filter(([_, details]) => details.rank > currentTierDetails.rank)
        .map(([key, details]) => {
            const difference = details.price - currentTierDetails.price;
            // Round to 2 decimal places to avoid floating point issues
            const roundedDifference = Math.round(difference * 100) / 100;
            return {
                key,
                ...details,
                difference: roundedDifference
            };
        });

    // 4. Handle Selected Target via Search Params
    const resolvedParams = await searchParams;
    let selectedOption = upgradeOptions[0]; // Default to the next available tier

    if (resolvedParams?.target) {
        const found = upgradeOptions.find(opt => opt.key === resolvedParams.target);
        if (found) selectedOption = found;
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] py-12 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <Link href="/dashboard" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
                        &larr; Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <ArrowUpRight className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Upgrade Your Plan</h1>
                            <p className="text-zinc-600 dark:text-zinc-400 mt-1">Unlock more features by paying just the difference.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Select Options */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Choose an Upgrade</h2>

                        {upgradeOptions.map((option) => {
                            const isSelected = selectedOption.key === option.key;

                            return (
                                <Link
                                    key={option.key}
                                    href={`/dashboard/upgrade?target=${option.key}`}
                                    className={`block bg-white dark:bg-zinc-900 rounded-2xl p-6 border-2 transition-all duration-200 ${isSelected
                                            ? 'border-indigo-600 dark:border-indigo-500 shadow-md ring-1 ring-indigo-600/20'
                                            : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex justify-between items-center sm:items-start flex-col sm:flex-row gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{option.name}</h3>
                                                {isSelected && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                Total Value: ${option.price}
                                            </p>
                                        </div>

                                        <div className="text-left sm:text-right bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60 shrink-0 min-w-[140px]">
                                            <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Upgrade Cost</div>
                                            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                                                ${option.difference}
                                            </div>
                                            <p className="text-[10px] text-zinc-500 font-medium">
                                                ≈ ₦{(option.difference * (Number(process.env.NEXT_PUBLIC_USD_TO_NGN_RATE) || 1400)).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Column: Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-24">
                            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Order Summary</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Current Plan</span>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{currentTierDetails.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Target Plan</span>
                                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{selectedOption.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Target Plan Price</span>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">${selectedOption.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Current Plan Credit</span>
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">-${currentTierDetails.price}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 mb-6">
                                    <span className="font-bold text-zinc-900 dark:text-white">Total Due</span>
                                    <div className="text-right">
                                        <span className="font-extrabold text-2xl text-zinc-900 dark:text-white">${selectedOption.difference}</span>
                                        <p className="text-xs text-zinc-500 font-medium">
                                            ≈ ₦{(selectedOption.difference * (Number(process.env.NEXT_PUBLIC_USD_TO_NGN_RATE) || 1400)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-xs flex gap-2 items-start mb-6">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>Upon successful payment, your account will be instantly upgraded to the {selectedOption.name} tier.</p>
                                </div>

                                <PaystackCheckout
                                    tier={selectedOption.key}
                                    amount={selectedOption.difference}
                                    email={user.email || ''}
                                    buttonText={`Pay $${selectedOption.difference}`}
                                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all duration-200 active:scale-[0.98] text-base"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
