import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const metadata = {
    title: 'Email Verified | CAD Fast Track',
};

export default async function VerifiedPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>
}) {
    const resolvedParams = await searchParams;
    const nextUrl = resolvedParams?.next || '/dashboard';

    return (
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-md p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
                <div className="inline-flex items-center justify-center p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-6 relative">
                    <CheckCircle2 className="w-12 h-12 relative z-10" />
                    <div className="absolute inset-0 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">Email Verified!</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                    Thank you for verifying your email address. Your account is now fully active.
                </p>
                <Link
                    href={nextUrl}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                    Continue
                </Link>
            </div>
        </div>
    );
}
