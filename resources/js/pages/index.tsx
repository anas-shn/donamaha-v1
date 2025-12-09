import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    GraduationCap,
    Heart,
    Smile,
    Stethoscope,
    Target,
    Users,
    UsersRound,
} from 'lucide-react';

interface Campaign {
    id: number;
    title: string;
    short_description: string;
    target_amount: number;
    collected_amount: number;
    image_path: string | null;
    end_date: string;
    organizer: {
        name: string;
    };
}

interface Props {
    campaigns: Campaign[];
}

export default function Home({ campaigns = [] }: Props) {
    const featuredCampaigns = campaigns.slice(0, 3);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateProgress = (collected: number, target: number) => {
        return Math.min((collected / target) * 100, 100);
    };

    const categories = [
        {
            icon: Smile,
            title: 'Healthy Food',
            description:
                'Providing nutritious meals to improve health and wellbeing for those in need',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
        },
        {
            icon: Stethoscope,
            title: 'Medical Help',
            description:
                'Ensuring access to quality healthcare and medical supplies for all',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            icon: UsersRound,
            title: 'Social Service',
            description:
                'Supporting community programs that strengthen social bonds',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
        },
        {
            icon: GraduationCap,
            title: 'Education',
            description:
                'Empowering through education and learning opportunities',
            color: 'text-pink-500',
            bgColor: 'bg-pink-50',
        },
    ];

    return (
        <>
            <Head title="Home - Donamaha" />
            <div className="bg-background min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <section className="gradient-hero relative overflow-hidden py-20">
                    {/* Decorative Elements */}
                    <div className="animate-float absolute top-[10%] right-[10%] h-32 w-32 rounded-full bg-yellow-200/30" />
                    <div className="animate-float-delayed absolute top-[30%] right-[20%] h-20 w-20 rounded-full bg-pink-200/30" />
                    <div className="animate-pulse-slow absolute top-[50%] right-[15%] h-24 w-24 rounded-full bg-purple-200/30" />

                    <div className="container-custom">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h1 className="text-foreground text-5xl leading-tight font-bold tracking-tight lg:text-6xl">
                                        Do Something Great to Help Others
                                    </h1>
                                    <p className="text-muted-foreground text-lg">
                                        Join us in making a difference. Your
                                        contribution can change lives and bring
                                        hope to those who need it the most.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Link href="/campaigns">
                                        <Button
                                            size="lg"
                                            className="bg-primary hover:bg-primary/90 btn-shadow text-white"
                                        >
                                            Donate Now
                                        </Button>
                                    </Link>
                                    <Link href="/volunteer">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-primary text-primary hover:bg-primary/10"
                                        >
                                            Watch Video
                                        </Button>
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-8 pt-8">
                                    <div>
                                        <div className="text-foreground text-3xl font-bold">
                                            15K
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            Volunteer
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-foreground text-3xl font-bold">
                                            100+
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            Campaigns
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-foreground text-3xl font-bold">
                                            600+
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            Donors
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Hero Images Grid */}
                            <div className="relative hidden lg:block">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="h-48 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop"
                                                alt="Volunteer"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="h-48 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop"
                                                alt="Community"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-8">
                                        <div className="h-48 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1609234656669-7164e41a6fc4?w=400&h=300&fit=crop"
                                                alt="Donation"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="h-48 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop"
                                                alt="Help"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Badge */}
                                <div className="absolute top-1/2 -right-4 flex -translate-y-1/2 items-center justify-center rounded-full bg-yellow-400 p-6 shadow-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            1M+
                                        </div>
                                        <div className="text-xs font-medium text-white">
                                            Donations
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-background py-20">
                    <div className="container-custom">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Images */}
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="h-48 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop"
                                                alt="Community work"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="h-64 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=400&fit=crop"
                                                alt="Helping others"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-12">
                                        <div className="h-64 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop"
                                                alt="Volunteers"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="h-48 overflow-hidden rounded-3xl">
                                            <img
                                                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop"
                                                alt="Support"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-6">
                                <div className="text-primary text-sm font-semibold tracking-wider uppercase">
                                    About Us
                                </div>
                                <h2 className="text-4xl leading-tight font-bold">
                                    Helping People In Need Around The World
                                </h2>
                                <p className="text-muted-foreground">
                                    We help people overcome life's greatest
                                    challenges to make around the world a better
                                    place for us and for the future.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-pink-50">
                                            <Heart className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Donate
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                Your kind contribution and
                                                helping hand can save a life
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-50">
                                            <Users className="text-secondary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Volunteer
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                Become a key partner with us and
                                                serve with your time
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="gradient-warm py-20">
                    <div className="container-custom">
                        <div className="mb-12 text-center">
                            <div className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
                                Categories
                            </div>
                            <h2 className="text-4xl font-bold">
                                Program to Empower Others
                            </h2>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {categories.map((category, index) => (
                                <Card
                                    key={index}
                                    className="shadow-card hover:shadow-hover border-border group cursor-pointer transition-all duration-300"
                                >
                                    <CardHeader>
                                        <div
                                            className={`${category.bgColor} mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full`}
                                        >
                                            <category.icon
                                                className={`${category.color} h-8 w-8`}
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold">
                                            {category.title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">
                                            {category.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <button className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-semibold transition-colors">
                                            Read More
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Campaigns */}
                <section className="bg-background py-20">
                    <div className="container-custom">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <div className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">
                                    Campaigns
                                </div>
                                <h2 className="text-4xl font-bold">
                                    Introduce Our Campaign
                                </h2>
                            </div>
                            <Link href="/campaigns">
                                <Button
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary/10 group"
                                >
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {featuredCampaigns.map((campaign) => (
                                <Card
                                    key={campaign.id}
                                    className="shadow-card hover:shadow-hover group overflow-hidden transition-all duration-300"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={
                                                campaign.image_path
                                                    ? `/storage/${campaign.image_path}`
                                                    : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop'
                                            }
                                            alt={campaign.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader>
                                        <Badge
                                            variant="secondary"
                                            className="mb-2 w-fit"
                                        >
                                            {campaign.organizer.name}
                                        </Badge>
                                        <h3 className="line-clamp-2 text-xl font-bold">
                                            {campaign.title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                            {campaign.short_description}
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Raised:
                                                </span>
                                                <span className="font-semibold">
                                                    {formatCurrency(
                                                        campaign.collected_amount,
                                                    )}
                                                </span>
                                            </div>
                                            <Progress
                                                value={calculateProgress(
                                                    campaign.collected_amount,
                                                    campaign.target_amount,
                                                )}
                                            />
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Goal:{' '}
                                                    {formatCurrency(
                                                        campaign.target_amount,
                                                    )}
                                                </span>
                                                <span className="text-primary font-semibold">
                                                    {calculateProgress(
                                                        campaign.collected_amount,
                                                        campaign.target_amount,
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link
                                            href={`/campaigns/${campaign.id}`}
                                            className="w-full"
                                        >
                                            <Button className="bg-primary hover:bg-primary/90 btn-shadow w-full text-white">
                                                Donate
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="gradient-hero relative overflow-hidden py-20">
                    <div className="container-custom">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Left Content */}
                            <div className="space-y-6">
                                <div className="text-primary text-sm font-semibold tracking-wider uppercase">
                                    Participate
                                </div>
                                <h2 className="text-4xl leading-tight font-bold lg:text-5xl">
                                    Participate In Charity Around The Whole
                                    World
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    Your small contribution can make someone's
                                    life better. Join us and donate to our
                                    charity campaigns.
                                </p>
                                <Link href="/register">
                                    <Button
                                        size="lg"
                                        className="bg-primary hover:bg-primary/90 btn-shadow text-white"
                                    >
                                        Become a Volunteer
                                    </Button>
                                </Link>
                            </div>

                            {/* Right Image */}
                            <div className="relative">
                                <div className="overflow-hidden rounded-3xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                                        alt="Volunteer"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Floating Stats */}
                                <div className="absolute top-4 left-4 rounded-2xl bg-white p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                                            <Target className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">
                                                $60M
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                Total Raised
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute right-4 bottom-4 rounded-2xl bg-white p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">
                                                25K+
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                Active Donors
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
