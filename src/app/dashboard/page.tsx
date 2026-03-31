import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { BookOpen, Calendar, Award, PlayCircle, Star, FileText, Lock } from 'lucide-react';
import Link from 'next/link';
import { CourseProgressBar } from '@/components/CourseProgressBar';
import { PaystackCheckout } from '@/components/PaystackCheckout';
import { CertificateClaimSection } from '@/components/CertificateClaimSection';

export const metadata = {
    title: 'Dashboard | CAD Fast Track',
};

const TIER_PRICING: Record<string, number> = {
    basic: 29.99,
    silver: 49.99,
    premium: 99.99,
    gold: 199.99
};

export default async function DashboardPage() {
    // 1. Verify Authentication
    const user = await getUserSession();

    if (!user) {
        redirect('/auth/login');
    }

    // 2. Fetch Synced Public Profile
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // 3. Access Control (The crucial check!)
    // If the user hasn't paid AND they aren't an admin, block access.
    const isPaid = profile?.has_paid === true;
    const isAdmin = profile?.role === 'admin';
    const hasAccess = isPaid || isAdmin;

    // Determine user's tier and scholarship price
    const userTier = profile?.plan_tier || 'basic';
    const scholarshipAmountStr = user.user_metadata?.scholarship_amount;

    let amountDue = TIER_PRICING[userTier as keyof typeof TIER_PRICING] || 99;

    if (scholarshipAmountStr) {
        amountDue = Number(scholarshipAmountStr);
    }

    if (!hasAccess) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Payment Required</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        To unlock your course dashboard and begin learning, please complete the payment for your selected plan.
                    </p>

                    <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20">
                        <strong>Just Paid?</strong> It may take a few seconds for access to activate. If you already paid, please 
                        <a href="/dashboard" className="underline ml-1 font-bold">click here to refresh</a>.
                    </p>

                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-zinc-500">Selected Plan:</span>
                            <span className="font-bold uppercase text-blue-600 dark:text-blue-400">{userTier}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500">Amount Due:</span>
                            <div className="text-right">
                                <span className="font-bold text-lg">${amountDue}</span>
                                <p className="text-[10px] text-zinc-500 font-medium">
                                    ≈ ₦{(amountDue * (Number(process.env.NEXT_PUBLIC_USD_TO_NGN_RATE) || 1400)).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <PaystackCheckout
                            tier={userTier}
                            amount={amountDue}
                            email={user.email || ''}
                            buttonText={`Pay $${amountDue} & Unlock Access`}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // 4. Setup Mock Data Defaults (would normally query course & count progress rows)
    const isPremiumOrGold = profile?.plan_tier === 'premium' || profile?.plan_tier === 'gold' || isAdmin;
    const totalDays = 30; // Hardcoded fallback or grab from Courses table
    const { data: userProgressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true);

    const completedDays = userProgressData ? userProgressData.length : 0;
    const nextLessonDay = completedDays + 1;
    const isFinished = completedDays >= totalDays && totalDays > 0;

    return (
        <div className="min-h-[calc(100vh-5rem)] py-12 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Student Dashboard</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                        Welcome back, {user.email}
                        {isAdmin && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">Admin View</span>}
                    </p>
                </div>

                {isFinished && (
                    <CertificateClaimSection initialName={(profile as any)?.full_name || ''} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Plan Details Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Award className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold">Current Plan</h2>
                        </div>

                        {profile ? (
                            <div className="flex-1 flex flex-col">
                                <div className="flex-1">
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 capitalize mt-1">
                                        {profile.plan_tier === 'gold' ? 'Gold Premium' : profile.plan_tier}
                                    </p>
                                    <p className="text-sm text-zinc-500 mt-2">Access to course materials based on your tier.</p>
                                </div>

                                {profile.plan_tier !== 'gold' && profile.role !== 'admin' && (
                                    <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                                        <Link
                                            href="/dashboard/upgrade"
                                            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            <Award className="w-4 h-4" />
                                            Upgrade Plan
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm animate-pulse">Syncing profile...</p>
                        )}
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold">Lessons Completed</h2>
                        </div>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                            {completedDays} <span className="text-lg text-zinc-500 font-normal">/ {totalDays}</span>
                        </p>
                    </div>

                    {/* Next Review Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold">Next Live Review</h2>
                        </div>
                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mt-1">
                            {!isPremiumOrGold ? 'Not included in tier' : 'Scheduling Coming Soon'}
                        </p>
                    </div>
                </div>

                <CourseProgressBar completedDays={completedDays} totalDays={totalDays} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h3 className="text-2xl font-bold">Your CAD Journey</h3>
                            </div>

                            <div className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">Continue Learning</h4>
                                    <p className="text-blue-700/80 dark:text-blue-300">Pick up right where you left off. Start Day {nextLessonDay} to unlock new materials.</p>
                                </div>

                                <Link
                                    href={`/dashboard/lessons/${nextLessonDay}`}
                                    className="shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Start Day {nextLessonDay}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Premium Sidebar Area */}
                    {isPremiumOrGold && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Star className="w-24 h-24 text-indigo-600" />
                                </div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-md">
                                        <Star className="w-3 h-3" />
                                        Premium Access
                                    </div>

                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Exclusive Content</h3>

                                    <ul className="space-y-3">
                                        <li>
                                            <Link href="#" className="flex items-center gap-3 p-3 bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 group">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm text-zinc-700 dark:text-zinc-200">1-on-1 Review Scheduling</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="#" className="flex items-center gap-3 p-3 bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm text-zinc-700 dark:text-zinc-200">Engineering Career Guide</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}

