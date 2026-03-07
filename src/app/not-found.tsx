import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 relative">
                <Compass className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin-slow" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                404
            </h1>
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                Lost in the Blueprint
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                We couldn't find the page you're looking for. It might have been moved, deleted, or you may have typed the address incorrectly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 w-full sm:w-auto"
                >
                    Return Home
                </Link>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-base font-medium rounded-xl text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
