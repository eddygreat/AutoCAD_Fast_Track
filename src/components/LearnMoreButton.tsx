import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import React from 'react';

interface LearnMoreButtonProps {
    method?: 'whatsapp' | 'email';
    whatsappNumber?: string;
    emailAddress?: string;
    className?: string;
    variant?: 'primary' | 'outline' | 'ghost';
    children?: React.ReactNode;
}

export function LearnMoreButton({
    method = 'whatsapp',
    whatsappNumber = '2347035333768', // User provided number formatted for international dialing
    emailAddress = 'support@cadfasttrack.com',
    className = '',
    variant = 'primary',
    children = 'Learn More'
}: LearnMoreButtonProps) {

    // Format the whatsapp number to remove any non-numeric characters just in case
    const formattedNumber = whatsappNumber.replace(/\D/g, '');

    const href = method === 'whatsapp'
        ? `https://wa.me/${formattedNumber}?text=I%20want%20to%20learn%20more%20about%20the%20autocad-fast-track%20course.`
        : `mailto:${emailAddress}?subject=Inquiry:%20CAD%20Fast%20Track`;

    const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-[0.98]";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10",
        ghost: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {method === 'whatsapp' ? <MessageCircle className="w-5 h-5" /> : null}
            {children}
            {method === 'email' ? <ArrowRight className="w-4 h-4" /> : null}
        </a>
    );
}
