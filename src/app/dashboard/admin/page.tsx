import { getUserSession } from '@/app/auth/session';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldCheck, UserCheck, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { AdminProgressBadge } from '@/components/AdminProgressBadge';
import { AuthorizeClientButton } from './AuthorizeClientButton';
import { ScholarshipLinkGenerator } from './ScholarshipLinkGenerator';
import { CertificateSettings } from './CertificateSettings';
import Link from 'next/link';

export const metadata = {
    title: 'Admin Dashboard | CAD Fast Track',
};

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string, tier?: string }>
}) {
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

    // 2. Resolve Search Filters
    const resolvedParams = await searchParams;
    const currentStatus = resolvedParams?.status || 'all';
    const currentTier = resolvedParams?.tier || 'all';

    // 3. Build Query
    let query = supabase
        .from('users')
        .select('id, email, role, has_paid, plan_tier, created_at')
        .order('created_at', { ascending: false });

    if (currentStatus === 'paid') {
        query = query.eq('has_paid', true);
    } else if (currentStatus === 'unpaid') {
        query = query.eq('has_paid', false);
    }

    if (currentTier !== 'all') {
        query = query.eq('plan_tier', currentTier);
    }

    const { data: allUsers, error: usersError } = await query;

    if (usersError) {
        console.error("Error fetching users for admin:", usersError);
    }

    // 4. Fetch Progress Counts for all users
    const { data: progressData } = await supabase
        .from('user_progress')
        .select('user_id')
        .eq('is_completed', true);

    // 5. Fetch Total Lessons Count
    const { count: totalLessonsCount } = await supabase
        .from('daily_lessons')
        .select('*', { count: 'exact', head: true });

    const totalLessons = totalLessonsCount || 30; // Fallback to 30

    // Map user IDs to their completed counts
    const userProgressMap: Record<string, number> = {};
    progressData?.forEach(p => {
        userProgressMap[p.user_id] = (userProgressMap[p.user_id] || 0) + 1;
    });

    // 6. Get Scholarship Settings
    const { getScholarshipSettings } = await import('./actions');
    const settings = await getScholarshipSettings();

    // Helper for generating filter URLs
    const createFilterUrl = (type: 'status' | 'tier', value: string) => {
        const params = new URLSearchParams();
        if (type === 'status') {
            if (value !== 'all') params.set('status', value);
            if (currentTier !== 'all') params.set('tier', currentTier);
        } else {
            if (currentStatus !== 'all') params.set('status', currentStatus);
            if (value !== 'all') params.set('tier', value);
        }
        const qs = params.toString();
        return `/dashboard/admin${qs ? `?${qs}` : ''}`;
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ScholarshipLinkGenerator
                        isActive={settings.scholarship_active}
                        currentCode={settings.scholarship_code}
                    />
                    <CertificateSettings 
                        initialSettings={{
                            issuer_name: settings.issuer_name,
                            issuer_title: settings.issuer_title,
                            issuer_signature_url: settings.issuer_signature_url
                        }} 
                    />
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Registered Students ({allUsers?.length || 0})
                        </h3>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <Filter className="w-4 h-4 text-zinc-500 ml-1 shrink-0" />

                                <div className="space-x-1 border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-1 flex items-center">
                                    <span className="text-xs font-semibold text-zinc-500 uppercase px-1">Status:</span>
                                    {['all', 'paid', 'unpaid'].map(status => (
                                        <Link
                                            key={status}
                                            href={createFilterUrl('status', status)}
                                            className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${currentStatus === status
                                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                                                }`}
                                        >
                                            {status}
                                        </Link>
                                    ))}
                                </div>

                                <div className="space-x-1 flex items-center">
                                    <span className="text-xs font-semibold text-zinc-500 uppercase px-1">Tier:</span>
                                    {['all', 'basic', 'silver', 'premium', 'gold'].map(tier => (
                                        <Link
                                            key={tier}
                                            href={createFilterUrl('tier', tier)}
                                            className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${currentTier === tier
                                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-600'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                                                }`}
                                        >
                                            {tier}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Progress</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <AdminProgressBadge 
                                                    completed={userProgressMap[student.id] || 0} 
                                                    total={totalLessons} 
                                                />
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
                                            No users found matching these filters.
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
