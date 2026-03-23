'use client';

import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Award, User } from 'lucide-react';
import { updateCertificateSettings } from './actions';

interface CertificateSettingsProps {
    initialSettings: {
        issuer_name: string;
        issuer_title: string;
        issuer_signature_url: string;
    };
}

export function CertificateSettings({ initialSettings }: CertificateSettingsProps) {
    const [name, setName] = useState(initialSettings.issuer_name || '');
    const [title, setTitle] = useState(initialSettings.issuer_title || '');
    const [signatureBase64, setSignatureBase64] = useState(initialSettings.issuer_signature_url || '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 500000) { // 500KB limit
            setMessage({ type: 'error', text: 'Image too large. Please use a file under 500KB.' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSignatureBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            const result = await updateCertificateSettings({
                issuer_name: name,
                issuer_title: title,
                issuer_signature_url: signatureBase64
            });

            if (result.success) {
                setMessage({ type: 'success', text: 'Certificate settings updated successfully!' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update settings.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Award className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Certificate Authority</h2>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Issuer Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Edward Manasseh"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            Issuer Title / Designation
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Lead Instructor, CAD Fast Track"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">
                        Digital Signature (Transparent PNG recommended)
                    </label>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group w-full md:w-64 h-32 bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl flex items-center justify-center overflow-hidden transition-colors hover:border-indigo-400 dark:hover:border-indigo-500">
                            {signatureBase64 ? (
                                <img src={signatureBase64} alt="Signature" className="max-h-full object-contain p-4" />
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                                    <p className="text-xs text-zinc-500">Upload Signature</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        <div className="flex-1 space-y-2 text-sm text-zinc-500">
                            <p>• Recommended: 400x150px PNG with transparent background.</p>
                            <p>• This signature will appear automatically on all issued certificates.</p>
                            <p>• Max file size: 500KB.</p>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${
                        message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                        : 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                    }`}>
                        {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-zinc-500/10 flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Certificate Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
