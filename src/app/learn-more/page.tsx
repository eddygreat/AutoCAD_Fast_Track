import { LearnMoreButton } from '@/components/LearnMoreButton';

export const metadata = {
    title: 'Learn More | CAD Fast Track',
};

export default function LearnMorePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-20 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Want to learn more?</h1>
            <LearnMoreButton variant="primary" className="text-lg px-8 py-4">
                Contact us via WhatsApp
            </LearnMoreButton>
        </div>
    );
}
