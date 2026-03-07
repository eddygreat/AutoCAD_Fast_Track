'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Something went wrong!
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto text-base">
                An unexpected error occurred. Our team has been notified. We apologize for the inconvenience.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 w-full sm:w-auto"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-base font-medium rounded-xl text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
