import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Heart,
    History,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';

interface Campaign {
    id: number;
    title: string;
    image_path: string | null;
    target_amount: number;
    collected_amount: number;
}

interface Donation {
    id: number;
    amount: number;
    status: string;
    created_at: string;
    campaign: Campaign;
}

interface Props {
    donations: Donation[];
    stats: {
        totalDonated: number;
        totalDonations: number;
        campaignsHelped: number;
        pendingDonations: number;
    };
}

export default function Dashboard({ donations, stats }: Props) {
    const recentDonations = donations.slice(0, 5);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Berhasil
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Pending
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Dibatalkan
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Dashboard - Donamaha" />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-green-50/30">
                <Navbar />

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="to-primary-dark bg-gradient-to-r from-primary py-12 text-white">
                        <div className="container-custom">
                            <div className="max-w-4xl">
                                <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                                    Dashboard Saya
                                </h1>
                                <p className="text-lg text-white/90">
                                    Kelola donasi dan lihat dampak yang telah Anda
                                    buat
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Statistics Cards */}
                    <section className="py-8">
                        <div className="container-custom">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* Total Donated */}
                                <Card className="shadow-card border-l-4 border-l-primary">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Donasi
                                        </CardTitle>
                                        <Wallet className="h-5 w-5 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-primary">
                                            {formatCurrency(stats.totalDonated)}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Terkumpul dari semua donasi
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Total Campaigns */}
                                <Card className="shadow-card border-l-4 border-l-secondary">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Kampanye Dibantu
                                        </CardTitle>
                                        <Heart className="h-5 w-5 text-secondary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {stats.campaignsHelped}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Kampanye yang berbeda
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Total Donations Count */}
                                <Card className="shadow-card border-l-4 border-l-green-500">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Jumlah Donasi
                                        </CardTitle>
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">
                                            {stats.totalDonations}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Donasi berhasil
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Pending Donations */}
                                <Card className="shadow-card border-l-4 border-l-yellow-500">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Donasi Pending
                                        </CardTitle>
                                        <History className="h-5 w-5 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {stats.pendingDonations}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Menunggu pembayaran
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Recent Donations */}
                    <section className="py-8">
                        <div className="container-custom">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">
                                                Donasi Terbaru
                                            </CardTitle>
                                            <CardDescription>
                                                5 donasi terakhir yang Anda buat
                                            </CardDescription>
                                        </div>
                                        <Link href="/donations">
                                            <Button variant="outline">
                                                Lihat Semua
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {recentDonations.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentDonations.map((donation) => (
                                                <div
                                                    key={donation.id}
                                                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    {/* Campaign Image */}
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                                        {donation.campaign
                                                            .image_path ? (
                                                            <img
                                                                src={`/storage/${donation.campaign.image_path}`}
                                                                alt={
                                                                    donation
                                                                        .campaign
                                                                        .title
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                                                <Heart className="h-6 w-6 text-primary" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Donation Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`/campaigns/${donation.campaign.id}`}
                                                            className="font-semibold hover:text-primary"
                                                        >
                                                            {
                                                                donation.campaign
                                                                    .title
                                                            }
                                                        </Link>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                            <span>
                                                                {formatCurrency(
                                                                    donation.amount,
                                                                )}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {formatDate(
                                                                    donation.created_at,
                                                                )}
                                                            </span>
                                                            <span>•</span>
                                                            {getStatusBadge(
                                                                donation.status,
                                                            )}
                                                        </div>

                                                        {/* Progress Bar for Campaign */}
                                                        <div className="mt-2">
                                                            <Progress
                                                                value={Math.min(
                                                                    (donation
                                                                        .campaign
                                                                        .collected_amount /
                                                                        donation
                                                                            .campaign
                                                                            .target_amount) *
                                                                        100,
                                                                    100,
                                                                )}
                                                                className="h-1.5"
                                                            />
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {formatCurrency(
                                                                    donation
                                                                        .campaign
                                                                        .collected_amount,
                                                                )}{' '}
                                                                dari{' '}
                                                                {formatCurrency(
                                                                    donation
                                                                        .campaign
                                                                        .target_amount,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="flex-shrink-0">
                                                        {donation.status ===
                                                        'pending' ? (
                                                            <Link
                                                                href={`/donations/${donation.id}/payment`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    className="w-full"
                                                                >
                                                                    Bayar
                                                                    Sekarang
                                                                </Button>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`/campaigns/${donation.campaign.id}`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                >
                                                                    Lihat
                                                                    Campaign
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                Belum Ada Donasi
                                            </h3>
                                            <p className="mb-6 text-gray-500">
                                                Mulai berbagi kebaikan dengan
                                                berdonasi ke kampanye yang Anda
                                                percaya
                                            </p>
                                            <Link href="/">
                                                <Button>
                                                    <Heart className="mr-2 h-4 w-4" />
                                                    Jelajahi Kampanye
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="py-8">
                        <div className="container-custom">
                            <h2 className="mb-6 text-2xl font-bold">
                                Aksi Cepat
                            </h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <Link href="/">
                                    <Card className="shadow-card transition-all hover:shadow-hover hover:-translate-y-1 cursor-pointer">
                                        <CardHeader>
                                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <CardTitle>
                                                Jelajahi Kampanye
                                            </CardTitle>
                                            <CardDescription>
                                                Temukan kampanye yang membutuhkan
                                                dukungan Anda
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>

                                <Link href="/donations">
                                    <Card className="shadow-card transition-all hover:shadow-hover hover:-translate-y-1 cursor-pointer">
                                        <CardHeader>
                                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                                <History className="h-6 w-6" />
                                            </div>
                                            <CardTitle>
                                                Riwayat Donasi
                                            </CardTitle>
                                            <CardDescription>
                                                Lihat semua donasi yang telah
                                                Anda buat
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>

                                <Link href="/reports">
                                    <Card className="shadow-card transition-all hover:shadow-hover hover:-translate-y-1 cursor-pointer">
                                        <CardHeader>
                                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                                                <TrendingUp className="h-6 w-6" />
                                            </div>
                                            <CardTitle>Laporan Kampanye</CardTitle>
                                            <CardDescription>
                                                Baca laporan perkembangan
                                                kampanye
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
