import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
            <div className="container-custom">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-foreground hover:text-primary flex items-center space-x-2 text-xl font-bold transition-colors"
                    >
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold">Donamaha</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        <Link
                            href="/"
                            className="text-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/campaigns"
                            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                            Campaigns
                        </Link>
                        <Link
                            href="/reports"
                            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                            Coverage
                        </Link>
                        <Link
                            href="/news"
                            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                            News
                        </Link>
                        <Link
                            href="/volunteer"
                            className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                        >
                            Volunteer
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden items-center md:flex">
                        <Link href="/register">
                            <Button className="bg-primary hover:bg-primary/90 btn-shadow text-white">
                                Join as a Member
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="hover:bg-muted rounded-md p-2 md:hidden">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};
