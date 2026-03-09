'use client';

import { useState, useTransition } from 'react';
import { Link2, Copy, Check, Info, Power, Loader2 } from 'lucide-react';
import { toggleScholarship } from './actions';

export function ScholarshipLinkGenerator({ isActive, currentCode }: { isActive: boolean, currentCode: string }) {
    const [tier, setTier] = useState('premium');
    const [amount, setAmount] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleGenerate = () => {
        if (!amount || isNaN(Number(amount))) return;

        // Ensure we have the base URL (works in browser)
        const baseUrl = window.location.origin;
        // Use the dynamically generated DB secret code instead of hardcoded
        const secretCode = currentCode || 'CAD-SCHOLAR-2026';

        const link = `${baseUrl}/enroll/scholarship?tier=${tier}&amount=${amount}&code=${secretCode}`;
        setGeneratedLink(link);
        setIsCopied(false);
    };

    const handleCopy = async () => {
        if (!generatedLink) return;

        try {
            await navigator.clipboard.writeText(generatedLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleToggle = () => {
        startTransition(async () => {
            const result = await toggleScholarship(!isActive);
            if (!result.error && !isActive) {
                // Changing to active resets old link visually since old links are dead
                setGeneratedLink('');
            }
        });
    };

    return (
        <div className={`rounded-2xl shadow-sm border p-6 transition-colors ${isActive ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800/50'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                        <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            Discount Link Generator
                            {!isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider">Disabled</span>}
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Create custom discounted enrollment links for partial scholarships.</p>
                    </div>
                </div>

                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/40'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-900/40'
                        }`}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                    {isActive ? 'Disable Links' : 'Enable Links'}
                </button>
            </div>

            <div className={`space-y-4 transition-opacity ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Target Tier</label>
                        <select
                            value={tier}
                            onChange={(e) => setTier(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="basic">Basic</option>
                            <option value="silver">Silver</option>
                            <option value="premium">Premium</option>
                            <option value="gold">Gold Premium</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Discounted Price ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 50"
                            min="1"
                            className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleGenerate}
                        disabled={!amount}
                        className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Generate Link
                    </button>
                </div>

                {generatedLink && (
                    <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-800 dark:text-indigo-300">
                                Send this link to the student. When they register, they will be given a checkout for exactly <strong>${amount}</strong>.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <code className="flex-1 block p-3 bg-white dark:bg-zinc-950 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-xs break-all text-zinc-800 dark:text-zinc-300 font-mono shadow-inner">
                                {generatedLink}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="shrink-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                title="Copy to clipboard"
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
