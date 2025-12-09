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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, Link } from '@inertiajs/react';
import { Clock, Filter, Heart, Search, Target, Users } from 'lucide-react';
import { useState } from 'react';

interface Campaign {
    id: number;
    title: string;
    short_description?: string;
    full_description: string;
    target_amount: number;
    collected_amount: number;
    status: string;
    image_path: string | null;
    start_date: string;
    end_date: string;
    organizer: {
        id: number;
        name: string;
        avatar?: string | null;
    };
}

interface Props {
    campaigns: Campaign[];
}

export default function CampaignsIndex({ campaigns }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('latest');

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

    const calculateDaysLeft = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        return days > 0 ? days : 0;
    };

    const filteredCampaigns = campaigns
        .filter((campaign) => {
            const matchesSearch =
                search === '' ||
                campaign.title.toLowerCase().includes(search.toLowerCase()) ||
                campaign.full_description
                    .toLowerCase()
                    .includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' || campaign.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'latest') {
                return (
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime()
                );
            }
            if (sortBy === 'progress') {
                return (
                    calculateProgress(b.collected_amount, b.target_amount) -
                    calculateProgress(a.collected_amount, a.target_amount)
                );
            }
            if (sortBy === 'urgent') {
                return (
                    calculateDaysLeft(a.end_date) -
                    calculateDaysLeft(b.end_date)
                );
            }
            return 0;
        });

    const activeCampaigns = campaigns.filter((c) => c.status === 'active');
    const totalRaised = campaigns.reduce(
        (sum, c) => sum + c.collected_amount,
        0,
    );
    const totalTarget = campaigns.reduce((sum, c) => sum + c.target_amount, 0);

    return (
        <>
            <Head title="All Campaigns - Sombohelp" />
            <div className="bg-background min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <section className="gradient-hero border-b py-16">
                    <div className="container-custom">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
                                Make a Difference Today
                            </h1>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Browse through our active campaigns and choose
                                where your contribution can have the greatest
                                impact.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="shadow-card rounded-2xl bg-white p-6">
                                    <div className="mb-2 flex justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Target className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {activeCampaigns.length}
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        Active Campaigns
                                    </div>
                                </div>
                                <div className="shadow-card rounded-2xl bg-white p-6">
                                    <div className="mb-2 flex justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                                            <Users className="h-6 w-6 text-secondary" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(totalRaised)}
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        Total Raised
                                    </div>
                                </div>
                                <div className="shadow-card rounded-2xl bg-white p-6">
                                    <div className="mb-2 flex justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                            <Heart className="h-6 w-6 text-accent" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {(
                                            (totalRaised / totalTarget) *
                                            100
                                        ).toFixed(0)}
                                        %
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        Overall Progress
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="border-b bg-white py-6">
                    <div className="container-custom">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            {/* Search */}
                            <div className="relative flex-1 md:max-w-md">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-3">
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={sortBy}
                                    onValueChange={setSortBy}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">
                                            Latest First
                                        </SelectItem>
                                        <SelectItem value="progress">
                                            Most Progress
                                        </SelectItem>
                                        <SelectItem value="urgent">
                                            Most Urgent
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="text-muted-foreground mt-4 text-sm">
                            Showing {filteredCampaigns.length} of{' '}
                            {campaigns.length} campaigns
                        </div>
                    </div>
                </section>

                {/* Campaigns Grid */}
                <section className="bg-background py-16">
                    <div className="container-custom">
                        {filteredCampaigns.length === 0 ? (
                            <div className="shadow-card mx-auto max-w-md rounded-2xl border bg-white p-12 text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                                        <Heart className="text-muted-foreground h-8 w-8" />
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    No Campaigns Found
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Try adjusting your search or filter criteria
                                </p>
                                <Button
                                    className="mt-6"
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredCampaigns.map((campaign) => {
                                    const daysLeft = calculateDaysLeft(
                                        campaign.end_date,
                                    );
                                    const progress = calculateProgress(
                                        campaign.collected_amount,
                                        campaign.target_amount,
                                    );

                                    return (
                                        <Card
                                            key={campaign.id}
                                            className="group shadow-card hover:shadow-hover overflow-hidden transition-all duration-300"
                                        >
                                            {/* Image */}
                                            <Link
                                                href={`/campaigns/${campaign.id}`}
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    {campaign.image_path ? (
                                                        <img
                                                            src={`/storage/${campaign.image_path}`}
                                                            alt={campaign.title}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                            <Heart className="h-16 w-16 text-primary/40" />
                                                        </div>
                                                    )}
                                                    {/* Status Badge */}
                                                    <div className="absolute top-4 left-4">
                                                        <Badge
                                                            variant={
                                                                campaign.status ===
                                                                'active'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {campaign.status}
                                                        </Badge>
                                                    </div>
                                                    {/* Days Left Badge */}
                                                    {daysLeft > 0 &&
                                                        campaign.status ===
                                                            'active' && (
                                                            <div className="absolute top-4 right-4">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-white/90"
                                                                >
                                                                    <Clock className="mr-1 h-3 w-3" />
                                                                    {daysLeft}{' '}
                                                                    days
                                                                </Badge>
                                                            </div>
                                                        )}
                                                </div>
                                            </Link>

                                            <CardHeader>
                                                <Badge
                                                    variant="outline"
                                                    className="mb-2 w-fit"
                                                >
                                                    {campaign.organizer.name}
                                                </Badge>
                                                <Link
                                                    href={`/campaigns/${campaign.id}`}
                                                >
                                                    <h3 className="line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                                                        {campaign.title}
                                                    </h3>
                                                </Link>
                                            </CardHeader>

                                            <CardContent className="space-y-4">
                                                <p className="text-muted-foreground line-clamp-2 text-sm">
                                                    {campaign.short_description ||
                                                        campaign.full_description}
                                                </p>

                                                {/* Progress */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-semibold">
                                                            {formatCurrency(
                                                                campaign.collected_amount,
                                                            )}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            of{' '}
                                                            {formatCurrency(
                                                                campaign.target_amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={progress}
                                                    />
                                                    <div className="text-muted-foreground flex justify-between text-xs">
                                                        <span>
                                                            {progress.toFixed(
                                                                1,
                                                            )}
                                                            % raised
                                                        </span>
                                                        <span>
                                                            {formatCurrency(
                                                                campaign.target_amount -
                                                                    campaign.collected_amount,
                                                            )}{' '}
                                                            to go
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="flex gap-2">
                                                <Link
                                                    href={`/campaigns/${campaign.id}`}
                                                    className="flex-1"
                                                >
                                                    <Button className="btn-shadow w-full bg-primary text-white hover:bg-primary/90">
                                                        Donate Now
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/campaigns/${campaign.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Heart className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
