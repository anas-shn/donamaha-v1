import { Link } from '@inertiajs/react';
import { Facebook, Heart, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-background border-border/40 border-t">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo & Description */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="text-foreground mb-4 flex items-center space-x-2 text-xl font-bold"
                        >
                            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white">
                                <Heart className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-xl font-bold">Donamaha</span>
                        </Link>
                        <p className="text-muted-foreground mb-6 max-w-md text-sm">
                            A platform dedicated to helping people around the
                            world. Together we can make a difference through
                            compassion and action.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Menu Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Menu
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/campaigns"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Campaigns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/news"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/volunteer"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Volunteer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                            Categories
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/campaigns?category=health"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Healthy Food
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/campaigns?category=medical"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Medical Help
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/campaigns?category=education"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Education
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/campaigns?category=social"
                                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                                >
                                    Social Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-border/40 mt-12 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-muted-foreground text-sm">
                            Copyright {new Date().getFullYear()}. All Rights
                            Reserved
                        </p>
                        <div className="flex gap-6">
                            <Link
                                href="/privacy"
                                className="text-muted-foreground hover:text-primary text-sm transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-muted-foreground hover:text-primary text-sm transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
