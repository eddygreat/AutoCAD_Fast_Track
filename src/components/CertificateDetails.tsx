'use client';

import React from 'react';
import { Award, ShieldCheck, Calendar, Zap, Printer } from 'lucide-react';

interface CertificateDetailsProps {
    fullName: string;
    completionDate: string;
    verificationId: string;
    issuerName: string;
    issuerTitle: string;
    issuerSignatureUrl: string;
}

export function CertificateDetails({
    fullName,
    completionDate,
    verificationId,
    issuerName,
    issuerTitle,
    issuerSignatureUrl
}: CertificateDetailsProps) {
    return (
        <div className="max-w-5xl mx-auto flex flex-col items-center">
            {/* Certificate Container */}
            <div className="certificate-container relative w-full aspect-[1.414/1] bg-white text-zinc-900 border-[16px] border-zinc-900 p-16 flex flex-col items-center justify-between text-center overflow-hidden shadow-2xl print:shadow-none print:border-[12px] print:w-full print:h-full print:aspect-auto">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full -mr-32 -mt-32 border border-zinc-100 print:hidden"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-zinc-50 rounded-full -ml-24 -mb-24 border border-zinc-100 print:hidden"></div>
                
                {/* Header Section */}
                <div className="relative z-10 w-full flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-zinc-900">
                         <Zap className="w-8 h-8 fill-zinc-900" />
                         <span className="font-black text-xl tracking-tighter">CAD FAST TRACK</span>
                    </div>
                    <div className="text-zinc-400 text-xs font-mono tracking-widest uppercase">
                        Verification ID: {verificationId}
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-10 py-8">
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold tracking-[0.4em] text-zinc-400 uppercase">Certificate of Completion</h2>
                        <div className="w-32 h-1 bg-zinc-900 mx-auto"></div>
                    </div>

                    <p className="text-xl italic font-serif text-zinc-500">This is to certify that</p>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 py-4 border-b-4 border-zinc-100 min-w-[70%] capitalize">
                        {fullName}
                    </h1>

                    <p className="max-w-3xl text-xl text-zinc-600 leading-relaxed">
                        has successfully completed the <span className="font-black text-zinc-900">CAD Fast Track: 30-Day Intensive</span> mastery program, demonstrating exceptional proficiency in professional computer-aided design, technical drafting, and engineering workflow optimization.
                    </p>
                </div>

                {/* Footer / Signature Section */}
                <div className="relative z-10 w-full grid grid-cols-3 items-end pt-12 border-t-2 border-zinc-50">
                    <div className="text-left space-y-2">
                        <div className="flex items-center gap-2 text-zinc-900 font-black text-lg mb-2">
                            <Calendar className="w-5 h-5 text-zinc-400" />
                            {completionDate}
                        </div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Issue Date</div>
                    </div>

                    <div className="flex justify-center pb-4">
                        <div className="w-24 h-24 border-8 border-zinc-900 rounded-full flex items-center justify-center rotate-12 shadow-inner">
                            <Award className="w-12 h-12 text-zinc-900" />
                        </div>
                    </div>

                    <div className="text-right space-y-2">
                        <div className="relative min-h-[100px] flex flex-col items-end justify-end">
                            {issuerSignatureUrl ? (
                                <img 
                                    src={issuerSignatureUrl} 
                                    alt="Signature" 
                                    className="max-h-20 object-contain mix-blend-multiply mb-1" 
                                />
                            ) : (
                                <div className="h-12 border-b-2 border-zinc-100 w-48 mb-2 italic text-zinc-200 text-sm flex items-end justify-center">Digital Signature Verified</div>
                            )}
                            <div className="font-black text-xl text-zinc-900">{issuerName}</div>
                            <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{issuerTitle}</div>
                        </div>
                        <div className="flex items-center justify-end gap-1.5 text-zinc-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Officially Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Action Card */}
            <div className="mt-12 w-full max-w-3xl bg-white dark:bg-zinc-950 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl print:hidden">
                <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Printer className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="font-black text-zinc-900 dark:text-white text-2xl">Official Documentation</h3>
                        <p className="text-zinc-500 max-w-sm">Save your lifetime accomplishment. Select <span className="font-bold text-zinc-900 dark:text-zinc-200">Save as PDF</span> in the print destination.</p>
                     </div>
                </div>
                <button 
                    onClick={() => window.print()} 
                    className="w-full md:w-auto px-10 py-5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                >
                    <Printer className="w-6 h-6" />
                    Print / Save as PDF
                </button>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .certificate-container {
                        width: 100vw !important;
                        height: 100vh !important;
                        border-width: 15mm !important;
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        margin: 0 !important;
                        box-sizing: border-box !important;
                    }
                    nav, footer, .print-hidden {
                        display: none !important;
                    }
                }
            `}} />
        </div>
    );
}
