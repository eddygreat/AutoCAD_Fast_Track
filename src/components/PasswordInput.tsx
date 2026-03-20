'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput({
    id = "password",
    name = "password",
    minLength,
    placeholder = "••••••••",
    className = "",
}: {
    id?: string;
    name?: string;
    minLength?: number;
    placeholder?: string;
    className?: string;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={showPassword ? 'text' : 'password'}
                className={`flex h-10 w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-800 dark:focus:ring-blue-500 pr-10 ${className}`}
                required
                minLength={minLength}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}
