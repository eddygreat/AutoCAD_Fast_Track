'use client';

import { useState } from 'react';
import { Link2, Copy, Check, Info } from 'lucide-react';

export function ScholarshipLinkGenerator() {
    const [tier, setTier] = useState('premium');
    const [amount, setAmount] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleGenerate = () => {
        if (!amount || isNaN(Number(amount))) return;

        // Ensure we have the base URL (works in browser)
        const baseUrl = window.location.origin;
        // In a real app, you might want to fetch this secret from an API if you want to be able to rotate it,
        // but for a simple implementation, we can ensure the admin knows it's hardcoded to the env var on the server.
        // The server validates it anyway.
        const secretCode = 'CAD-SCHOLAR-2026';

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

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Link2 className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Discount Link Generator</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Create custom discounted enrollment links for partial scholarships.</p>
                </div>
            </div>

            <div className="space-y-4">
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
