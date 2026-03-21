'use client';

import { useState } from 'react';
import { authorizeUser, deleteUser, revokeUserAccess } from './actions';
import { Loader2, Settings2, ShieldOff, Trash2, ArrowRight } from 'lucide-react';

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
    const [isRevoking, setIsRevoking] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTier, setSelectedTier] = useState(currentTier || 'premium');
    const [error, setError] = useState('');

    const handleAuthorize = async () => {
        setIsLoading(true);
        setIsDeleting(false);
        setIsRevoking(false);
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

    const handleRevoke = async () => {
        if (!confirm(`Are you sure you want to revoke access for ${userEmail}? This will set them back to 'Unpaid'.`)) return;

        setIsLoading(true);
        setIsRevoking(true);
        setError('');

        const result = await revokeUserAccess(userId);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            setIsRevoking(false);
        } else {
            setIsOpen(false);
            setIsLoading(false);
            setIsRevoking(false);
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

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg shadow-sm text-white transition-colors ${isPaid
                    ? 'bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                <Settings2 className="w-3.5 h-3.5" />
                {isPaid ? 'Manage Access' : 'Authorize Student'}
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
                                {isPaid ? 'Update Access' : 'Authorize User'}
                            </h4>
                            <p className="text-xs text-zinc-500 mb-4 truncate border-b border-zinc-100 dark:border-zinc-700 pb-3">
                                {userEmail}
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="tier" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                        Access Tier
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
                                        onClick={handleAuthorize}
                                        disabled={isLoading}
                                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
                                    >
                                        {isLoading && !isDeleting && !isRevoking ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            isPaid ? 'Update Tier' : 'Authorize'
                                        )}
                                    </button>
                                </div>

                                {isPaid && (
                                    <button
                                        onClick={handleRevoke}
                                        disabled={isLoading}
                                        className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-amber-200 dark:border-amber-900/30 shadow-sm text-xs font-bold rounded-lg text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 focus:outline-none transition-colors mt-2"
                                    >
                                        {isLoading && isRevoking ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldOff className="w-3.5 h-3.5" />
                                                Revoke Access (Refund)
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50/50 dark:bg-red-950/20 p-4 border-t border-red-100 dark:border-red-900/30">
                            {showDeleteConfirm ? (
                                <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                                    <p className="text-xs text-red-700 dark:text-red-400 font-bold">
                                        PERMANENTLY DELETE? 
                                        {isPaid && " (Paid User)"}
                                    </p>
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
                                            className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors flex justify-center items-center"
                                        >
                                            {isLoading && isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Yes, Delete USER'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full text-left text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete User Account</span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
