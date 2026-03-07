import { resetPassword } from '../actions';
import { PasswordInput } from '@/components/PasswordInput';
import Link from 'next/link';

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const resolvedParams = await searchParams;

    return (
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">

                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Set New Password</h1>
                    <p className="text-sm text-zinc-500 mt-2">Please enter your new password below.</p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">New Password</label>
                        <PasswordInput />
                        <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters long.</p>
                    </div>

                    <button
                        formAction={resetPassword}
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 py-2 shadow-sm shadow-blue-600/20 mt-4 active:scale-[0.98]"
                    >
                        Update Password
                    </button>

                    {resolvedParams?.message && (
                        <p className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm text-center rounded-lg">
                            {resolvedParams.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
