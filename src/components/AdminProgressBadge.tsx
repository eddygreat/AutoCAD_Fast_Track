import React from 'react';

interface AdminProgressBadgeProps {
  completed: number;
  total: number;
}

export function AdminProgressBadge({ completed, total }: AdminProgressBadgeProps) {
  const safeTotal = total > 0 ? total : 30;
  const percentage = Math.round(Math.min(100, Math.max(0, (completed / safeTotal) * 100)));
  
  // Determine color based on progress
  let bgColor = 'bg-zinc-100 dark:bg-zinc-800';
  let textColor = 'text-zinc-600 dark:text-zinc-400';
  let borderColor = 'border-zinc-200 dark:border-zinc-700';

  if (percentage >= 80) {
    bgColor = 'bg-emerald-100 dark:bg-emerald-900/30';
    textColor = 'text-emerald-700 dark:text-emerald-400';
    borderColor = 'border-emerald-200 dark:border-emerald-800';
  } else if (percentage >= 40) {
    bgColor = 'bg-blue-100 dark:bg-blue-900/30';
    textColor = 'text-blue-700 dark:text-blue-400';
    borderColor = 'border-blue-200 dark:border-blue-800';
  } else if (percentage > 0) {
    bgColor = 'bg-amber-100 dark:bg-amber-900/30';
    textColor = 'text-amber-700 dark:text-amber-400';
    borderColor = 'border-amber-200 dark:border-amber-800';
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className={textColor}>{completed}/{safeTotal} Lessons</span>
        <span className={textColor}>{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-transparent shadow-inner">
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            percentage >= 80 ? 'bg-emerald-500' : 
            percentage >= 40 ? 'bg-blue-500' : 
            percentage > 0 ? 'bg-amber-500' : 'bg-zinc-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
