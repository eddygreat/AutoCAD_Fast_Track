'use client';

import { useState } from 'react';
import { authorizeUser, deleteUser } from './actions';
import { Loader2, Settings2 } from 'lucide-react';

export function AuthorizeClientButton({
    userId,
    userEmail,
    isPaid,
    currentTier
}: {
    userId: string,
    userEmail: string,
    isPaid: boolean,
    currentTier: string
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTier, setSelectedTier] = useState('premium');
    const [error, setError] = useState('');

    const handleAuthorize = async () => {
        setIsLoading(true);
        setIsDeleting(false);
        setError('');

        const result = await authorizeUser(userId, selectedTier);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        setIsDeleting(true);
        setError('');

        const result = await deleteUser(userId);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        } else {
            setIsOpen(false);
            setIsLoading(false);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (isPaid) {
        return (
            <button
                disabled
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 cursor-not-allowed"
            >
                Authorized
            </button>
        );
    }

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <Settings2 className="w-3.5 h-3.5" />
                Manage Access
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none z-20 overflow-hidden">
                        <div className="p-4">
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                                Authorize User
                            </h4>
                            <p className="text-xs text-zinc-500 mb-4 truncate border-b border-zinc-100 dark:border-zinc-700 pb-3">
                                {userEmail}
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="tier" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                        Select Access Tier
                                    </label>
                                    <select
                                        id="tier"
                                        value={selectedTier}
                                        onChange={(e) => setSelectedTier(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-600 border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="silver">Silver</option>
                                        <option value="premium">Premium</option>
                                        <option value="gold">Gold</option>
                                    </select>
                                </div>

                                {error && (
                                    <p className="text-xs text-red-600 dark:text-red-400">
                                        {error}
                                    </p>
                                )}

                                <div className="pt-2 flex gap-2">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        disabled={isLoading}
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-zinc-300 dark:border-zinc-600 shadow-sm text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAuthorize}
                                        disabled={isLoading}
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex-shrink-0 transition-colors"
                                    >
                                        {isLoading && !isDeleting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Authorize'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone: Only show for unpaid users */}
                        <div className="bg-red-50/50 dark:bg-red-950/20 p-4 border-t border-red-100 dark:border-red-900/30">
                            {showDeleteConfirm ? (
                                <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                                    <p className="text-xs text-red-700 dark:text-red-400 font-medium">Are you sure? This cannot be undone.</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={isLoading}
                                            className="flex-1 py-1.5 px-2 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                            className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors flex justify-center items-center"
                                        >
                                            {isLoading && isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Yes, Delete'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full text-left text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 flex items-center justify-between group"
                                >
                                    <span>Delete Unpaid User</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                                </button>
                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
