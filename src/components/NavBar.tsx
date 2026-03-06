'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, UserCircle, ShieldCheck } from 'lucide-react';
import { signout } from '@/app/auth/actions';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
];

export function NavBar({ user, role }: { user: any, role?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isAdmin = role === 'admin';

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <Compass className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
                                CAD Fast Track
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-zinc-600 dark:text-zinc-400'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* Auth / CTA Section */}
                        <div className="flex items-center gap-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/dashboard/admin"
                                            className="flex items-center gap-1.5 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Admin
                                        </Link>
                                    )}
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors"
                                    >
                                        <UserCircle className="w-5 h-5" />
                                        Dashboard
                                    </Link>
                                    <form action={signout}>
                                        <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-3">
                                            Logout
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/enroll"
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                                    >
                                        Enroll Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out absolute w-full overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-none'
                    }`}
            >
                <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block px-3 py-3 rounded-lg text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                        {user ? (
                            <div className="space-y-2">
                                {isAdmin && (
                                    <Link
                                        href="/dashboard/admin"
                                        className="flex items-center justify-center gap-2 w-full px-3 py-3 text-center rounded-xl text-base font-bold text-red-600 bg-red-50 dark:bg-red-900/20"
                                    >
                                        <ShieldCheck className="w-5 h-5" />
                                        Admin Console
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="block w-full px-3 py-3 text-center rounded-xl text-base font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                >
                                    Go to Dashboard
                                </Link>
                                <form action={signout}>
                                    <button type="submit" className="w-full px-3 py-3 text-center rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href="/enroll"
                                    className="block w-full px-3 py-3 text-center rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Enroll Now
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="block w-full px-3 py-3 text-center rounded-xl text-base font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
