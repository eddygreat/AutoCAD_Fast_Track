import { scholarshipSignup } from './actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PasswordInput } from '@/components/PasswordInput';

export const metadata = {
    title: 'Scholarship Registration | CAD Fast Track',
};

export default async function ScholarshipRegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string; tier: string; amount: string; code: string }>
}) {
    const resolvedParams = await searchParams;
    const selectedTier = resolvedParams?.tier;
    const amount = resolvedParams?.amount;
    const code = resolvedParams?.code;

    // Secret verification (Basic security to prevent URL tampering)
    const SECRET_CODE = process.env.SCHOLARSHIP_SECRET_CODE || 'CAD-SCHOLAR-2026';

    if (!selectedTier || !amount || !code || code !== SECRET_CODE) {
        // Log unauthorized attempt if desired
        redirect('/enroll');
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">

                <div className="text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold tracking-wider uppercase shadow-sm">
                        Scholarship Offer
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Create an Account</h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
                        You have been granted a special scholarship rate for the <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">{selectedTier}</span> tier at <span className="font-bold text-emerald-600 dark:text-emerald-400">${amount}</span>.
                    </p>
                </div>

                <form className="space-y-4">
                    {/* Hidden inputs to pass data to the server action */}
                    <input type="hidden" name="tier" value={selectedTier} />
                    <input type="hidden" name="amount" value={amount} />
                    <input type="hidden" name="code" value={code} />

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="flex h-10 w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-800 dark:focus:ring-blue-500"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                        <PasswordInput minLength={6} placeholder="********" />
                        <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters long.</p>
                    </div>

                    <button
                        formAction={scholarshipSignup}
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 py-2 shadow-lg shadow-blue-600/20 mt-6 active:scale-[0.98]"
                    >
                        Sign up & Continue to Payment
                    </button>

                    {resolvedParams?.message && (
                        <p className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm text-center rounded-xl font-medium border border-red-200 dark:border-red-800/50">
                            {resolvedParams.message}
                        </p>
                    )}

                    <div className="text-center pt-6 border-t border-zinc-100 dark:border-zinc-800/60 mt-6">
                        <p className="text-sm text-zinc-500">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-bold transition-colors">
                                Log in instead
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
