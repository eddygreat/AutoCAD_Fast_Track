import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: 'Basic',
        value: 'basic',
        price: '$1.00',
        description: 'Perfect for self-starters who want to learn at their own pace.',
        features: [
            'Self-paced learning',
            '14 days system plan',
            'Core CAD materials',
            'Community forum access'
        ],
        highlighted: false,
    },
    {
        name: 'Silver',
        value: 'silver',
        price: '$49.99',
        description: 'Accelerate your learning with expert review and guidance.',
        features: [
            'Everything in Basic',
            '30 days system plan',
            'Weekly live instructor review',
            'Practice assignments'
        ],
        highlighted: false,
    },
    {
        name: 'Premium',
        value: 'premium',
        price: '$99.99',
        description: 'A structured intensive program designed for serious commitment.',
        features: [
            'Everything in Silver',
            'Structured 4-week program',
            'Weekly course reviews',
            'Comprehensive Career Guide'
        ],
        highlighted: true, // Emphasize this tier
    },
    {
        name: 'Gold Premium',
        value: 'gold',
        price: '$199.99',
        description: 'The ultimate investment in your engineering future.',
        features: [
            'Everything in Premium',
            '1-year mentorship access',
            'Resume/CV Builder',
            'Interview Prep App Access'
        ],
        highlighted: false,
    }
];

export const metadata = {
    title: 'Enroll Now | CAD Fast Track Pricing',
};

export default function EnrollPage() {
    return (
        <div className="min-h-screen py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white">
                        Choose Your Learning Path
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
                        Invest in your engineering career. Select the training tier that best aligns with your goals and schedule.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative flex flex-col p-8 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2
                ${tier.highlighted
                                    ? 'bg-blue-600 border-2 border-blue-500 shadow-blue-600/20 text-white'
                                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 text-zinc-900 dark:text-white'
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                                    {tier.name}
                                </h3>
                                <p className={`text-sm h-10 ${tier.highlighted ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                    {tier.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-extrabold">{tier.price}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.highlighted ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}`} />
                                        <span className={`text-sm font-medium ${tier.highlighted ? 'text-zinc-100' : 'text-zinc-600 dark:text-zinc-300'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/auth/register?tier=${tier.value}`}
                                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all active:scale-[0.98]
                  ${tier.highlighted
                                        ? 'bg-white text-blue-600 hover:bg-zinc-50'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                                    }`}
                            >
                                Select {tier.name}
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
