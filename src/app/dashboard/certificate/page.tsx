import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { CertificateDetails } from '@/components/CertificateDetails';

export const metadata = {
    title: 'Your Certificate | CAD Fast Track',
};

export default async function CertificatePage() {
    const user = await getUserSession();
    if (!user) redirect('/auth/login');

    const supabase = await createClient();
    
    // 1. Fetch User Profile
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. Fetch App Settings for Signature
    const { data: settings } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (!profile?.full_name) {
        redirect('/dashboard');
    }

    const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 py-12 px-4 print:p-0 print:bg-white print:min-h-0">
            <CertificateDetails 
                fullName={profile.full_name}
                completionDate={completionDate}
                verificationId={`${user.id.substring(0, 8).toUpperCase()}-CERT`}
                issuerName={settings?.issuer_name || 'Edward Manasseh'}
                issuerTitle={settings?.issuer_title || 'Lead Instructor'}
                issuerSignatureUrl={settings?.issuer_signature_url || ''}
            />
        </div>
    );
}
