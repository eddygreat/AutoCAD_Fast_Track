import { LearnMoreButton } from '@/components/LearnMoreButton';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-5rem)]">
            {/* Hero Section */}
            <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden py-20 lg:py-32">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-zinc-900/20 -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 ring-1 ring-blue-600/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                New Project Management Courses Available
                            </div>

                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                                Master CAD & <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    Technical Engineering
                                </span>
                            </h1>

                            <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light leading-relaxed mb-12 mx-auto lg:mx-0">
                                Elevate your career with expert-led courses in CAD design, technical report development, and project management. Build the skills industry leaders demand.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                                <Link
                                    href="/enroll"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-200 active:scale-[0.98] text-lg"
                                >
                                    Start Learning Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <LearnMoreButton
                                    variant="outline"
                                    className="w-full sm:w-auto px-8 py-4 text-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
                                >
                                    Contact Support
                                </LearnMoreButton>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 transform hover:scale-[1.02] transition-transform duration-500">
                                <Image
                                    src="/autocad_drafter_hero.png"
                                    alt="Professional AutoCAD drafter working on a multi-monitor setup"
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-cover aspect-square sm:aspect-[4/3] lg:aspect-square"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* Decorative elements behind image */}
                            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 -z-10 blur-xl" />
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800/60 max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Industry Expert Tutors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Hands-on CAD Projects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span>Flexible Learning Path</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
