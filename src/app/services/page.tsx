import { Compass, FileText, Network, PenTool, ClipboardList } from 'lucide-react';
import { LearnMoreButton } from '@/components/LearnMoreButton';

const services = [
    {
        title: 'CAD Designs',
        description: 'Expert-level 2D drafting and 3D modeling tailored to your specific engineering and architectural requirements.',
        icon: Compass,
        color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    },
    {
        title: 'Technical Report Development',
        description: 'Comprehensive, structured technical documentation and reporting for engineering projects and compliance.',
        icon: FileText,
        color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    },
    {
        title: 'Design Basis Development',
        description: 'Establish robust foundational parameters, load calculations, and criteria for successful structural execution.',
        icon: Network,
        color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    },
    {
        title: 'CAD Training',
        description: 'Interactive, project-based AutoCAD and CAD software training programs for beginners to advanced users.',
        icon: PenTool,
        color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    },
    {
        title: 'Project Management Training',
        description: 'Learn industry-standard methodologies to plan, execute, and deliver complex engineering projects on time.',
        icon: ClipboardList,
        color: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    }
];

export const metadata = {
    title: 'Our Services | CAD Fast Track',
    description: 'Explore our design and training services including CAD drafting, technical reports, and project management courses.',
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">
                        Our Premium Services
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
                        A comprehensive suite of engineering design and professional development solutions crafted to accelerate your career and project success.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.title}
                                className="group relative flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Decorative background glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex-1">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${service.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
                                        {service.title}
                                    </h3>

                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                        {service.description}
                                    </p>

                                    <div className="mt-auto">
                                        <LearnMoreButton variant="outline" className="w-full">
                                            Learn More
                                        </LearnMoreButton>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
