export function CourseProgressBar({ completedDays, totalDays }: { completedDays: number; totalDays: number }) {
    // Guard against divide by zero or weird math
    const safeTotal = totalDays > 0 ? totalDays : 1;
    const rawPercentage = (completedDays / safeTotal) * 100;
    const percentage = Math.round(Math.min(100, Math.max(0, rawPercentage)));

    return (
        <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Course Progress</h3>
                    <p className="text-sm text-zinc-500">
                        {completedDays} of {totalDays} lessons completed
                    </p>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {percentage}%
                </span>
            </div>

            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
