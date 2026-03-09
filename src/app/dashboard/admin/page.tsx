import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldCheck, UserCheck, CheckCircle2, XCircle } from 'lucide-react';
import { AuthorizeClientButton } from './AuthorizeClientButton';
import { ScholarshipLinkGenerator } from './ScholarshipLinkGenerator';

export const metadata = {
    title: 'Admin Dashboard | CAD Fast Track',
};

export default async function AdminDashboardPage() {
    // 1. Verify Authentication & Role
    const user = await getUserSession();
    if (!user) {
        redirect('/auth/login');
    }

    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/dashboard');
    }

    // 2. Fetch all users from the users table, sorted by newest first
    const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('id, email, role, has_paid, plan_tier, created_at')
        .order('created_at', { ascending: false });

    if (usersError) {
        console.error("Error fetching users for admin:", usersError);
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] py-12 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Admin Console</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Manage user access and manual authorizations.</p>
                    </div>
                </div>

                <div className="mb-8">
                    <ScholarshipLinkGenerator />
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Registered Students ({allUsers?.length || 0})
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Registered</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Current Tier</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
                                {allUsers?.map((student) => {
                                    const date = new Date(student.created_at).toLocaleDateString();
                                    const isPaid = student.has_paid;

                                    return (
                                        <tr key={student.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-500 dark:text-zinc-400">{date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.role === 'admin'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                                                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                                                    }`}>
                                                    {student.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {isPaid ? (
                                                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                                        Paid
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-sm text-amber-600 dark:text-amber-500 font-medium">
                                                        <XCircle className="w-4 h-4 mr-1.5" />
                                                        Unpaid
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 uppercase font-medium">
                                                {student.plan_tier}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <AuthorizeClientButton userId={student.id} userEmail={student.email} isPaid={student.has_paid} currentTier={student.plan_tier} />
                                            </td>
                                        </tr>
                                    );
                                })}

                                {(!allUsers || allUsers.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
