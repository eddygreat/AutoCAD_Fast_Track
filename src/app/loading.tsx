import { Compass } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Compass className="w-16 h-16 text-blue-600 dark:text-blue-500 animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 animate-pulse">
                    Loading content...
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                    Preparing your CAD learning experience
                </p>
            </div>
        </div>
    );
}
