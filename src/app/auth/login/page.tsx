import { login } from '../actions';
import Link from 'next/link';
import { PasswordInput } from '@/components/PasswordInput';

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const resolvedParams = await searchParams;

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">

                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome Back</h1>
                    <p className="text-sm text-zinc-500 mt-2">Log in to CAD Fast Track to continue.</p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-800 dark:focus:ring-blue-500"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                        <PasswordInput />
                    </div>

                    <button
                        formAction={login}
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 py-2 shadow-sm shadow-blue-600/20 mt-4 active:scale-[0.98]"
                    >
                        Log in
                    </button>

                    {resolvedParams?.message && (
                        <p className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm text-center rounded-lg">
                            {resolvedParams.message}
                        </p>
                    )}

                    <div className="text-center pt-4">
                        <p className="text-sm text-zinc-500">
                            Don't have an account?{' '}
                            <Link href="/enroll" className="text-blue-600 hover:text-blue-500 font-medium">
                                Enroll Now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
