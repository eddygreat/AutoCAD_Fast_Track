import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CAD Fast Track | Master Computer-Aided Design',
    description: 'Elevate your engineering career with expert-led CAD designs, technical report development, and project management training.',
    keywords: 'CAD, AutoCAD, Engineering, Technical Reporting, Project Management, 3D Design',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserSession();

    let role;
    if (user) {
        const supabase = await createClient();
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        role = profile?.role;
    }

    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-blue-200 dark:selection:bg-blue-900/50`}>
                <NavBar user={user} role={role} />
                <main className="pt-20 min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
