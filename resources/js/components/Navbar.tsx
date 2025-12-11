import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePage } from '@inertiajs/react';
import {
    Heart,
    History,
    LogOut,
    PlusCircle,
    Settings,
    ShieldCheck,
    User,
} from 'lucide-react';

interface Auth {
    user?: {
        id: number;
        name: string;
        email: string;
        role?: string;
    };
}

interface PageProps {
    auth: Auth;
}

export const Navbar = () => {
    const { auth } = usePage<PageProps>().props;
    return (
        <nav className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
            <div className="container-custom">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-foreground flex items-center space-x-2 text-xl font-bold transition-colors hover:text-primary"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold">Donamaha</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 md:flex">
                        <Link
                            href="/"
                            className="text-foreground text-sm font-medium transition-colors hover:text-primary"
                        >
                            Home
                        </Link>
                        <Link
                            href="/campaigns"
                            className="text-muted-foreground text-sm font-medium transition-colors hover:text-primary"
                        >
                            Campaigns
                        </Link>
                        <Link
                            href="/reports"
                            className="text-muted-foreground text-sm font-medium transition-colors hover:text-primary"
                        >
                            Reports
                        </Link>
                        {auth.user && (
                            <Link
                                href="/donations"
                                className="text-muted-foreground text-sm font-medium transition-colors hover:text-primary"
                            >
                                History
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden items-center gap-4 md:flex">
                        {auth.user?.role === 'admin' && (
                            <a href="/admin">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Admin Panel</span>
                                </Button>
                            </a>
                        )}
                        {auth.user?.role === 'organizer' && (
                            <Link href="/campaigns/create">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Tambah Kampanye</span>
                                </Button>
                            </Link>
                        )}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>{auth.user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/dashboard"
                                            className="flex w-full cursor-pointer items-center"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/donations"
                                            className="flex w-full cursor-pointer items-center"
                                        >
                                            <History className="mr-2 h-4 w-4" />
                                            <span>Donation History</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/settings/profile"
                                            className="flex w-full cursor-pointer items-center"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex w-full cursor-pointer items-center text-red-600"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="btn-shadow bg-primary text-white hover:bg-primary/90">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
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
