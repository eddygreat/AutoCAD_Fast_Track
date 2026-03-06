'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { markLessonComplete } from '@/app/dashboard/actions';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

interface LessonQuizProps {
    lessonId: string;
    quizJson: any; // Ideally QuizQuestion[], but keeping any to safely parse strings if needed
    alreadyCompleted: boolean;
}

export function LessonQuiz({ lessonId, quizJson, alreadyCompleted }: LessonQuizProps) {
    const router = useRouter();

    // Safe parsing logic just in case it's stringified
    const questions: QuizQuestion[] | null = typeof quizJson === 'string' ? JSON.parse(quizJson) : quizJson;

    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If no quiz, auto-complete logic could go here, but for now we block
    if (!questions || questions.length === 0) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center">
                <p className="text-zinc-500">No quiz available for this lesson.</p>
            </div>
        );
    }

    const handleSelect = (qIndex: number, oIndex: number) => {
        if (hasSubmitted) return;
        setSelectedAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswerIndex) {
                correct++;
            }
        });
        return (correct / questions.length) * 100;
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedAnswers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setIsSubmitting(true);
        const calculatedScore = calculateScore();
        setScore(calculatedScore);
        setHasSubmitted(true);

        // Call server action to update Supabase
        try {
            await markLessonComplete(lessonId, calculatedScore);
            router.refresh();
        } catch (e) {
            console.error("Failed to mark complete", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setSelectedAnswers({});
        setHasSubmitted(false);
        setScore(0);
    };

    const isPassing = score >= 80;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold">Knowledge Check</h2>
                {alreadyCompleted && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                    </span>
                )}
            </div>

            <div className="space-y-8">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/60">
                        <p className="font-semibold text-lg mb-4">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-3">
                            {q.options.map((option, oIndex) => {
                                const isSelected = selectedAnswers[qIndex] === oIndex;
                                const isCorrect = q.correctAnswerIndex === oIndex;
                                const showCorrect = hasSubmitted && isCorrect;
                                const showWrong = hasSubmitted && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={oIndex}
                                        onClick={() => handleSelect(qIndex, oIndex)}
                                        disabled={hasSubmitted}
                                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${isSelected && !hasSubmitted
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                                                : showCorrect
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                                    : showWrong
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                                        : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-400 bg-white dark:bg-zinc-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                            {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {!hasSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-8 w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isSubmitting ? 'Sumitting...' : 'Submit Answers'}
                </button>
            ) : (
                <div className={`mt-8 p-6 rounded-xl border-2 flex flex-col items-center text-center ${isPassing
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50'
                        : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50'
                    }`}>
                    {isPassing ? (
                        <>
                            <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">You Passed!</h3>
                            <p className="text-green-700 dark:text-green-300">Score: {score}%.</p>
                            <p className="mt-2 text-sm font-medium text-green-800/70 dark:text-green-400/70">Your progress has been saved. You may now proceed to the next lesson.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-2">Retry Required</h3>
                            <p className="text-red-700 dark:text-red-300">Score: {score}% (80% Required).</p>
                            <button
                                onClick={handleRetry}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                            >
                                <RefreshCcw className="w-4 h-4" /> Try Again
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
