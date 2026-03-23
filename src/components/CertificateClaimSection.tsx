'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { updateUserName } from '@/app/dashboard/actions';
import { useRouter } from 'next/navigation';

interface CertificateClaimSectionProps {
    initialName: string;
}

export function CertificateClaimSection({ initialName }: CertificateClaimSectionProps) {
    const [name, setName] = useState(initialName || '');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleClaim = async () => {
        if (!name.trim()) return;
        
        setIsSaving(true);
        try {
            const result = await updateUserName(name);
            if (result.success) {
                router.push('/dashboard/certificate');
            } else {
                alert('Failed to save name. Please try again.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-16 -mb-16"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-6 flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-2">
                        <Award className="w-4 h-4" />
                        Course Accomplishment
                    </div>
                    
                    <h2 className="text-4xl font-black text-white leading-tight">
                        Congratulations! <br />
                        <span className="text-indigo-100">You've finished the course.</span>
                    </h2>
                    
                    <p className="text-indigo-100/80 text-lg max-w-xl mx-auto lg:mx-0">
                        You've successfully completed all 30 days of the CAD Fast Track program. 
                        Claim your official certificate of completion below.
                    </p>
                </div>

                <div className="w-full lg:w-[400px] bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-xl space-y-4 border border-white/20">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Name on Certificate
                        </label>
                        <p className="text-xs text-zinc-500 mb-2">Please enter your name exactly as you want it to appear.</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xl font-bold text-zinc-900 dark:text-white"
                        />
                    </div>

                    <button
                        onClick={handleClaim}
                        disabled={!name.trim() || isSaving}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-lg transition-all active:scale-95 shadow-lg ${
                            name.trim() && !isSaving 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30' 
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {isSaving ? 'Saving...' : (
                            <>
                                Claim Official Certificate
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center gap-2 text-xs text-zinc-500 justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Verified Digital Signature Included
                    </div>
                </div>
            </div>
        </div>
    );
}
