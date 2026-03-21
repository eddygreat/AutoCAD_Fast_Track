import { createClient } from '@/utils/supabase/server';
import { getUserSession } from '@/app/auth/session';
import { redirect } from 'next/navigation';
import { LessonContent } from '@/components/LessonContent';
import { LessonQuiz } from '@/components/LessonQuiz';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function DailyLessonPage({ params }: { params: Promise<{ day: string }> }) {
    const resolvedParams = await params;
    const dayNumber = parseInt(resolvedParams.day, 10);

    if (isNaN(dayNumber)) {
        redirect('/dashboard');
    }

    const user = await getUserSession();
    if (!user) {
        redirect('/auth/login');
    }

    const supabase = await createClient();

    // 1. Fetch User Profile to get their plan_tier and course_id
    const { data: profile } = await supabase
        .from('users')
        .select('plan_tier, has_paid, role')
        .eq('id', user.id)
        .single();

    if (!profile) {
        redirect('/auth/login');
    }

    // 2. Security Check: Only allow paid users or admins
    const isPaid = profile.has_paid === true;
    const isAdmin = profile.role === 'admin';
    if (!isPaid && !isAdmin) {
        redirect('/dashboard');
    }

    // NOTE: In a real system you'd look up the user's specific enrolled course ID. 
    // For this prototype, we'll grab the first available lesson matching the day.
    const { data: lesson, error: lessonError } = await supabase
        .from('daily_lessons')
        .select('*')
        .eq('day_number', dayNumber)
        .limit(1)
        .single();

    if (lessonError || !lesson) {
        return (
            <div className="min-h-screen py-24 flex flex-col items-center max-w-2xl mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Lesson Not Found</h1>
                <p className="text-zinc-500 mb-8">We couldn't find the lesson for Day {dayNumber}. This might be because the course hasn't been fully populated yet.</p>
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
            </div>
        );
    }

    // 2. Fetch Progress tracking
    const { data: progress } = await supabase
        .from('user_progress')
        .select('is_completed, quiz_score')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle();

    const isCompleted = progress?.is_completed || false;

    return (
        <div className="min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Navigation Breadcrumbs */}
                <div className="flex items-center text-sm text-zinc-500 mb-8 font-medium">
                    <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-zinc-900 dark:text-zinc-100">Day {dayNumber}</span>
                </div>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Day {dayNumber} Overview
                    </h1>
                </div>

                {/* Main Content (Video & Text) */}
                <LessonContent
                    textContent={lesson.text_content}
                    muxPlaybackId={lesson.mux_playback_id}
                />

                {/* Knowledge Check */}
                <LessonQuiz
                    lessonId={lesson.id}
                    quizJson={lesson.quiz_json}
                    alreadyCompleted={isCompleted}
                />

                {/* Pagination */}
                <div className="mt-12 flex justify-between items-center">
                    {dayNumber > 1 ? (
                        <Link
                            href={`/dashboard/lessons/${dayNumber - 1}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Previous Day
                        </Link>
                    ) : <div></div>}

                    {isCompleted && (
                        <Link
                            href={`/dashboard/lessons/${dayNumber + 1}`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-zinc-500/20"
                        >
                            Start Day {dayNumber + 1}
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
