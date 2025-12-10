import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
    calculateDaysLeft,
    calculateProgress,
    formatCurrency,
    formatDate,
} from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    Heart,
    Share2,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';
import { FormEventHandler } from 'react';

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
    created_at: string;
    organizer: {
        id: number;
        name: string;
        email: string;
        avatar?: string | null;
        nim?: string | null;
    };
    donations?: Array<{
        id: number;
        amount: number;
        note: string | null;
        created_at: string;
        donor_name?: string | null;
        is_anonymous?: boolean;
        donor: {
            name: string;
            avatar?: string | null;
        } | null;
    }>;
    reports?: Array<{
        id: number;
        title: string;
        description?: string;
        created_at: string;
    }>;
}

interface Props {
    campaign: Campaign;
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function CampaignShow({ campaign, auth }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        campaign_id: campaign.id,
        amount: '',
        note: '',
    });

    const handleDonate: FormEventHandler = (e) => {
        e.preventDefault();

        // Basic validation
        if (!data.amount || parseFloat(data.amount) < 1000) {
            alert('Minimum donation amount is Rp 1,000');
            return;
        }

        post('/donations', {
            preserveScroll: true,
            onSuccess: () => {
                // Form will automatically redirect to payment page
                // via DonationController@store
            },
            onError: (errors) => {
                console.error('Donation error:', errors);
                alert('Failed to process donation. Please try again.');
            },
        });
    };

    const progress = calculateProgress(
        campaign.collected_amount,
        campaign.target_amount,
    );
    const daysLeft = calculateDaysLeft(campaign.end_date);
    const donorCount = campaign.donations?.length || 0;

    return (
        <>
            <Head title={`${campaign.title} - Sombohelp`} />
            <div className="bg-background min-h-screen">
                <Navbar />

                {/* Hero Image */}
                <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                    {campaign.image_path ? (
                        <img
                            src={`/storage/${campaign.image_path}`}
                            alt={campaign.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Heart className="h-32 w-32 text-primary/40" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Breadcrumb */}
                    <div className="absolute top-8 right-0 left-0">
                        <div className="container-custom">
                            <div className="flex items-center gap-2 text-sm text-white">
                                <Link href="/" className="hover:underline">
                                    Home
                                </Link>
                                <span>/</span>
                                <Link
                                    href="/campaigns"
                                    className="hover:underline"
                                >
                                    Campaigns
                                </Link>
                                <span>/</span>
                                <span className="opacity-80">
                                    {campaign.title}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-8 right-8">
                        <Badge
                            variant={
                                campaign.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                            }
                            className="bg-white/90 text-base capitalize"
                        >
                            {campaign.status}
                        </Badge>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-12">
                    <div className="container-custom">
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Left Column - Campaign Details */}
                            <div className="space-y-8 lg:col-span-2">
                                {/* Title & Organizer */}
                                <div>
                                    <h1 className="mb-4 text-4xl leading-tight font-bold">
                                        {campaign.title}
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            {campaign.organizer.avatar ? (
                                                <img
                                                    src={
                                                        campaign.organizer
                                                            .avatar
                                                    }
                                                    alt={
                                                        campaign.organizer.name
                                                    }
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                                    {campaign.organizer.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold">
                                                    {campaign.organizer.name}
                                                </div>
                                                <div className="text-muted-foreground text-sm">
                                                    Campaign Organizer
                                                </div>
                                            </div>
                                        </div>
                                        <Separator
                                            orientation="vertical"
                                            className="h-12"
                                        />
                                        <Button variant="outline" size="sm">
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Stats Card */}
                                <Card className="shadow-card">
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <div className="text-3xl font-bold text-primary">
                                                        {formatCurrency(
                                                            campaign.collected_amount,
                                                        )}
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        raised of{' '}
                                                        {formatCurrency(
                                                            campaign.target_amount,
                                                        )}{' '}
                                                        goal
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">
                                                        {progress.toFixed(0)}%
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        funded
                                                    </div>
                                                </div>
                                            </div>
                                            <Progress
                                                value={progress}
                                                className="h-3"
                                            />
                                            <div className="grid grid-cols-3 gap-4 pt-2">
                                                <div className="text-center">
                                                    <div className="mb-1 flex justify-center">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                            <Users className="h-5 w-5 text-primary" />
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-bold">
                                                        {donorCount}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        Donors
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="mb-1 flex justify-center">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                                                            <Clock className="h-5 w-5 text-secondary" />
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-bold">
                                                        {daysLeft}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        Days Left
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="mb-1 flex justify-center">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                                                            <TrendingUp className="h-5 w-5 text-accent" />
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-bold">
                                                        {formatCurrency(
                                                            campaign.target_amount -
                                                                campaign.collected_amount,
                                                        )}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        To Go
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Campaign Description */}
                                <Card className="shadow-card">
                                    <CardHeader>
                                        <CardTitle>Campaign Story</CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose max-w-none">
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {campaign.full_description}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Campaign Timeline */}
                                <Card className="shadow-card">
                                    <CardHeader>
                                        <CardTitle>Campaign Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <Calendar className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        Started
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {formatDate(
                                                            campaign.start_date,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                                                    <Clock className="h-5 w-5 text-secondary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">
                                                        Ends
                                                    </div>
                                                    <div className="text-muted-foreground text-sm">
                                                        {formatDate(
                                                            campaign.end_date,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Donations */}
                                {campaign.donations &&
                                    campaign.donations.length > 0 && (
                                        <Card className="shadow-card">
                                            <CardHeader>
                                                <CardTitle>
                                                    Recent Donations
                                                </CardTitle>
                                                <CardDescription>
                                                    Thank you to all our
                                                    supporters
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {campaign.donations
                                                        .slice(0, 5)
                                                        .map((donation) => (
                                                            <div
                                                                key={
                                                                    donation.id
                                                                }
                                                                className="flex items-start justify-between border-b pb-4 last:border-0"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    {donation.donor ? (
                                                                        donation
                                                                            .donor
                                                                            .avatar ? (
                                                                            <img
                                                                                src={
                                                                                    donation
                                                                                        .donor
                                                                                        .avatar
                                                                                }
                                                                                alt={
                                                                                    donation
                                                                                        .donor
                                                                                        .name
                                                                                }
                                                                                className="h-10 w-10 rounded-full"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                                                {donation.donor.name
                                                                                    .charAt(
                                                                                        0,
                                                                                    )
                                                                                    .toUpperCase()}
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                                            <User className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <div className="font-semibold">
                                                                            {donation.is_anonymous
                                                                                ? 'Hamba Allah'
                                                                                : donation.donor_name ||
                                                                                  donation
                                                                                      .donor
                                                                                      ?.name ||
                                                                                  'Hamba Allah'}
                                                                        </div>
                                                                        {donation.note && (
                                                                            <p className="text-muted-foreground mt-1 text-sm">
                                                                                {
                                                                                    donation.note
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        <div className="text-muted-foreground mt-1 text-xs">
                                                                            {formatDate(
                                                                                donation.created_at,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-bold text-primary">
                                                                        {formatCurrency(
                                                                            donation.amount,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                            </div>

                            {/* Right Column - Donation Form */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-8 space-y-6">
                                    {/* Donation Form */}
                                    <Card className="shadow-card">
                                        <CardHeader>
                                            <CardTitle>
                                                Support This Campaign
                                            </CardTitle>
                                            <CardDescription>
                                                Your donation makes a difference
                                            </CardDescription>
                                        </CardHeader>
                                        <form onSubmit={handleDonate}>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="amount">
                                                        Donation Amount (Rp) *
                                                    </Label>
                                                    <Input
                                                        id="amount"
                                                        type="number"
                                                        placeholder="50000"
                                                        min="1000"
                                                        value={data.amount}
                                                        onChange={(e) =>
                                                            setData(
                                                                'amount',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                    {errors.amount && (
                                                        <p className="text-destructive text-sm">
                                                            {errors.amount}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Quick Amount Buttons */}
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        50000, 100000, 250000,
                                                    ].map((amount) => (
                                                        <Button
                                                            key={amount}
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setData(
                                                                    'amount',
                                                                    amount.toString(),
                                                                )
                                                            }
                                                        >
                                                            {formatCurrency(
                                                                amount,
                                                            )}
                                                        </Button>
                                                    ))}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="note">
                                                        Message (Optional)
                                                    </Label>
                                                    <Textarea
                                                        id="note"
                                                        placeholder="Leave a message of support..."
                                                        value={data.note}
                                                        onChange={(e) =>
                                                            setData(
                                                                'note',
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={3}
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                {auth?.user ? (
                                                    <Button
                                                        type="submit"
                                                        className="btn-shadow w-full bg-primary text-white hover:bg-primary/90"
                                                        disabled={processing}
                                                    >
                                                        <Heart className="mr-2 h-4 w-4" />
                                                        {processing
                                                            ? 'Processing...'
                                                            : 'Donate Now'}
                                                    </Button>
                                                ) : (
                                                    <Link
                                                        href="/login"
                                                        className="w-full"
                                                    >
                                                        <Button className="btn-shadow w-full bg-primary text-white hover:bg-primary/90">
                                                            Login to Donate
                                                        </Button>
                                                    </Link>
                                                )}
                                            </CardFooter>
                                        </form>
                                    </Card>

                                    {/* Organizer Info */}
                                    <Card className="shadow-card">
                                        <CardHeader>
                                            <CardTitle>Organizer</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-3">
                                                {campaign.organizer.avatar ? (
                                                    <img
                                                        src={
                                                            campaign.organizer
                                                                .avatar
                                                        }
                                                        alt={
                                                            campaign.organizer
                                                                .name
                                                        }
                                                        className="h-16 w-16 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                                                        {campaign.organizer.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold">
                                                        {
                                                            campaign.organizer
                                                                .name
                                                        }
                                                    </div>
                                                    {campaign.organizer.nim && (
                                                        <div className="text-muted-foreground text-sm">
                                                            NIM:{' '}
                                                            {
                                                                campaign
                                                                    .organizer
                                                                    .nim
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Share Card */}
                                    <Card className="shadow-card">
                                        <CardHeader>
                                            <CardTitle>
                                                Share Campaign
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="flex-1"
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="flex-1"
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="flex-1"
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
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
