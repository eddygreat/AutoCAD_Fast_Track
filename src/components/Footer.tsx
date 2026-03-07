import Link from 'next/link';
import { Compass, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <Compass className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                                CAD Fast Track
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs">
                            Elevating engineering careers through expert-led training in CAD, technical reporting, and project management.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-4">
                            Platform
                        </h3>
                        <ul className="space-y-3 whitespace-nowrap">
                            <li>
                                <Link href="/" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/enroll" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Enroll Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-3 whitespace-nowrap">
                            <li>
                                <Link href="#" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <a href="https://wa.me/2347035333768" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="mailto:edwardmanasseh@gmail.com" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Community Forums
                                </a>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Video Tutorials
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3 whitespace-nowrap">
                            <li>
                                <Link href="/legal/privacy" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/terms" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/cookies" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/refunds" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        &copy; {currentYear} CAD Fast Track Training Services. All rights reserved.
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        Designed with excellence for engineers
                    </p>
                </div>
            </div>
        </footer>
    );
}
