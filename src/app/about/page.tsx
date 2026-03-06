export const metadata = {
    title: 'About Us | CAD Fast Track',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">Our Mission</h1>
                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                        To empower technical professionals with practical, industry-ready AutoCAD skills in the shortest time possible.
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 space-y-8">
                    <p>
                        At CAD Fast Track, we understand that time is the most valuable asset for engineering and technical professionals.
                        Traditional CAD learning paths are often needlessly elongated and overly theoretical. Our training is designed to disrupt that paradigm.
                        We focus entirely on <strong>practical application</strong>.
                    </p>

                    <p>
                        Our specialized daily learning system is built around actionable concepts, real-world examples, and immediate assessments.
                        By leveraging our comprehensive student dashboard, learners engage with bite-sized daily lessons, video tutorials, and interactive quizzes.
                        This structured progression ensures that concepts are mastered and actively applied before moving to the next complex topic.
                    </p>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-sm border border-zinc-200 dark:border-zinc-800 my-12">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 mt-0">Why CAD Fast Track?</h2>
                        <ul className="space-y-5 mb-0 list-none pl-0">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-none">•</span>
                                <span><strong>Accelerated Timeline:</strong> Specialized programs ranging from a quick 14-day basic system to intensive 1-year mentorships to fit your schedule.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-none">•</span>
                                <span><strong>Structured Curriculum:</strong> Detailed daily lessons paired with integrated step-by-step video instruction so you learn exactly how to draft.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-none">•</span>
                                <span><strong>Knowledge Verification:</strong> Embedded daily quizzes requiring an 80% pass rate guarantee that you actually understand the material before progressing.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl leading-none">•</span>
                                <span><strong>Real-world Readiness:</strong> We prioritize what you actually need on the job, stripping away the fluff to teach you how to analyze and draft proficiently.</span>
                            </li>
                        </ul>
                    </div>

                    <p>
                        We have successfully built a robust platform equipped with interactive progress tracking, role-based dashboards, and carefully curated content.
                        Whether you are enrolling in our Basic plan to self-start or selecting the Gold Premium tier for comprehensive mentoring and resume building,
                        CAD Fast Track equips you with the exact tools you need to excel in the competitive architectural and engineering sectors.
                    </p>
                </div>
            </div>
        </div>
    );
}
