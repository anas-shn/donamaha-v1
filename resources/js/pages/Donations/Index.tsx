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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Download,
    FileText,
    Heart,
    HistoryIcon,
    Receipt,
    Search,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface Campaign {
    id: number;
    title: string;
    slug: string;
    image_path: string | null;
}

interface Payment {
    id: number;
    payment_method: string;
    payment_status: string;
    paid_at: string | null;
}

interface Donation {
    id: number;
    campaign_id: number;
    amount: number;
    note: string | null;
    status: string;
    created_at: string;
    campaign: Campaign;
    payment?: Payment;
}

interface Props {
    donations: Donation[];
}

export default function DonationsIndex({ donations }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');

    // Calculate statistics
    const totalDonated = donations
        .filter((d) => d.status === 'paid')
        .reduce((sum, d) => sum + d.amount, 0);
    const totalDonations = donations.filter((d) => d.status === 'paid').length;
    const pendingDonations = donations.filter(
        (d) => d.status === 'pending',
    ).length;

    // Filter donations
    const filteredDonations = donations.filter((donation) => {
        const matchesSearch = donation.campaign.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || donation.status === statusFilter;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const donationDate = new Date(donation.created_at);
            const now = new Date();
            const daysDiff = Math.floor(
                (now.getTime() - donationDate.getTime()) /
                    (1000 * 60 * 60 * 24),
            );

            switch (dateFilter) {
                case '7days':
                    matchesDate = daysDiff <= 7;
                    break;
                case '30days':
                    matchesDate = daysDiff <= 30;
                    break;
                case '90days':
                    matchesDate = daysDiff <= 90;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Berhasil
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Pending
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Dibatalkan
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleDownloadReceipt = (donationId: number) => {
        window.location.href = `/donations/${donationId}/receipt`;
    };

    return (
        <>
            <Head title="Riwayat Donasi - Donamaha" />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-green-50/30">
                <Navbar />

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="to-primary-dark bg-gradient-to-r from-primary py-16 text-white">
                        <div className="container-custom">
                            <div className="max-w-3xl">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                                        <HistoryIcon className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-4xl font-bold">
                                        Riwayat Donasi
                                    </h1>
                                </div>
                                <p className="text-xl text-white/90">
                                    Lihat semua donasi yang telah Anda berikan
                                    untuk berbagai kampanye
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Statistics Cards */}
                    <section className="py-8">
                        <div className="container-custom">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Total Donated */}
                                <Card className="shadow-card border-l-4 border-l-primary">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Donasi
                                        </CardTitle>
                                        <Heart className="h-5 w-5 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-primary">
                                            {formatCurrency(totalDonated)}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Dari {totalDonations} donasi
                                            berhasil
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Total Campaigns */}
                                <Card className="shadow-card border-l-4 border-l-secondary">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Kampanye Dibantu
                                        </CardTitle>
                                        <TrendingUp className="h-5 w-5 text-secondary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {
                                                new Set(
                                                    donations
                                                        .filter(
                                                            (d) =>
                                                                d.status ===
                                                                'paid',
                                                        )
                                                        .map(
                                                            (d) =>
                                                                d.campaign_id,
                                                        ),
                                                ).size
                                            }
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Kampanye yang berbeda
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Pending Donations */}
                                <Card className="shadow-card border-l-4 border-l-yellow-500">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Donasi Pending
                                        </CardTitle>
                                        <FileText className="h-5 w-5 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {pendingDonations}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Menunggu pembayaran
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Filters Section */}
                    <section className="border-b bg-white py-6">
                        <div className="container-custom">
                            <div className="flex flex-col gap-4 md:flex-row">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari kampanye..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div className="w-full md:w-48">
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Status
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Berhasil
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                Dibatalkan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Filter */}
                                <div className="w-full md:w-48">
                                    <Select
                                        value={dateFilter}
                                        onValueChange={setDateFilter}
                                    >
                                        <SelectTrigger>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Periode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Waktu
                                            </SelectItem>
                                            <SelectItem value="7days">
                                                7 Hari Terakhir
                                            </SelectItem>
                                            <SelectItem value="30days">
                                                30 Hari Terakhir
                                            </SelectItem>
                                            <SelectItem value="90days">
                                                90 Hari Terakhir
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Results count */}
                            <p className="mt-4 text-sm text-gray-600">
                                Menampilkan {filteredDonations.length} dari{' '}
                                {donations.length} donasi
                            </p>
                        </div>
                    </section>

                    {/* Donations Table/List */}
                    <section className="py-12">
                        <div className="container-custom">
                            {filteredDonations.length === 0 ? (
                                <Card className="shadow-card">
                                    <CardContent className="py-16 text-center">
                                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                            <HistoryIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                            Tidak ada riwayat donasi
                                        </h3>
                                        <p className="mb-6 text-gray-600">
                                            {search ||
                                            statusFilter !== 'all' ||
                                            dateFilter !== 'all'
                                                ? 'Tidak ada donasi yang sesuai dengan filter Anda'
                                                : 'Anda belum melakukan donasi. Mari mulai berbagi kebaikan!'}
                                        </p>
                                        <Link href="/campaigns">
                                            <Button className="btn-shadow bg-primary text-white hover:bg-primary/90">
                                                Lihat Kampanye
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    {/* Desktop Table */}
                                    <Card className="shadow-card hidden md:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Tanggal
                                                    </TableHead>
                                                    <TableHead>
                                                        Kampanye
                                                    </TableHead>
                                                    <TableHead>
                                                        Jumlah
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Aksi
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredDonations.map(
                                                    (donation) => (
                                                        <TableRow
                                                            key={donation.id}
                                                        >
                                                            <TableCell className="font-medium">
                                                                {formatDate(
                                                                    donation.created_at,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Link
                                                                    href={`/campaigns/${donation.campaign.id}`}
                                                                    className="font-medium text-primary hover:underline"
                                                                >
                                                                    {
                                                                        donation
                                                                            .campaign
                                                                            .title
                                                                    }
                                                                </Link>
                                                                {donation.note && (
                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        {
                                                                            donation.note
                                                                        }
                                                                    </p>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-semibold">
                                                                {formatCurrency(
                                                                    donation.amount,
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    donation.status,
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {donation.status ===
                                                                'paid' ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDownloadReceipt(
                                                                                donation.id,
                                                                            )
                                                                        }
                                                                        className="gap-2"
                                                                    >
                                                                        <Download className="h-3 w-3" />
                                                                        Kwitansi
                                                                    </Button>
                                                                ) : donation.status ===
                                                                  'pending' ? (
                                                                    <Link
                                                                        href={`/donations/${donation.id}/payment`}
                                                                    >
                                                                        <Button
                                                                            variant="default"
                                                                            size="sm"
                                                                            className="w-full"
                                                                        >
                                                                            Bayar
                                                                            Sekarang
                                                                        </Button>
                                                                    </Link>
                                                                ) : null}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Card>

                                    {/* Mobile Cards */}
                                    <div className="space-y-4 md:hidden">
                                        {filteredDonations.map((donation) => (
                                            <Card
                                                key={donation.id}
                                                className="shadow-card"
                                            >
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-base">
                                                                <Link
                                                                    href={`/campaigns/${donation.campaign.id}`}
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {
                                                                        donation
                                                                            .campaign
                                                                            .title
                                                                    }
                                                                </Link>
                                                            </CardTitle>
                                                            <CardDescription>
                                                                {formatDate(
                                                                    donation.created_at,
                                                                )}
                                                            </CardDescription>
                                                        </div>
                                                        {getStatusBadge(
                                                            donation.status,
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">
                                                            Jumlah Donasi:
                                                        </span>
                                                        <span className="text-lg font-bold text-primary">
                                                            {formatCurrency(
                                                                donation.amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {donation.note && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">
                                                                Catatan:
                                                            </span>{' '}
                                                            {donation.note}
                                                        </p>
                                                    )}
                                                    {donation.status ===
                                                        'paid' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDownloadReceipt(
                                                                    donation.id,
                                                                )
                                                            }
                                                            className="w-full gap-2"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download Kwitansi
                                                        </Button>
                                                    )}
                                                    {donation.status ===
                                                        'pending' && (
                                                        <Link
                                                            href={`/donations/${donation.id}/payment`}
                                                        >
                                                            <Button className="btn-shadow w-full bg-primary hover:bg-primary/90">
                                                                Bayar Sekarang
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="to-primary-dark bg-gradient-to-r from-primary py-12 text-white">
                        <div className="container-custom text-center">
                            <Receipt className="mx-auto mb-4 h-12 w-12 opacity-90" />
                            <h2 className="mb-4 text-3xl font-bold">
                                Terus Berbagi Kebaikan
                            </h2>
                            <p className="mx-auto mb-6 max-w-2xl text-white/90">
                                Setiap donasi Anda membuat perbedaan nyata.
                                Temukan kampanye lain yang membutuhkan bantuan.
                            </p>
                            <Link href="/campaigns">
                                <Button
                                    size="lg"
                                    className="btn-shadow bg-white text-primary hover:bg-white/90"
                                >
                                    Lihat Kampanye Lainnya
                                </Button>
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
