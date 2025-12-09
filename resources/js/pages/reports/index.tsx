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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, DollarSign, FileText, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface Campaign {
    id: number;
    title: string;
    slug: string;
}

interface Author {
    id: number;
    name: string;
}

interface Report {
    id: number;
    campaign_id: number;
    title: string;
    content: string;
    image_path: string | null;
    total_spent: number;
    published_at: string | null;
    created_at: string;
    campaign: Campaign;
    author: Author;
}

interface Props {
    reports: Report[];
    campaign_id?: number | null;
}

export default function ReportsIndex({ reports, campaign_id }: Props) {
    const [search, setSearch] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState<string>(
        campaign_id?.toString() || 'all',
    );

    // Get unique campaigns for filter
    const campaigns = Array.from(
        new Map(reports.map((r) => [r.campaign.id, r.campaign])).values(),
    );

    // Filter reports based on search and campaign
    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.title.toLowerCase().includes(search.toLowerCase()) ||
            report.content.toLowerCase().includes(search.toLowerCase());
        const matchesCampaign =
            selectedCampaign === 'all' ||
            report.campaign_id.toString() === selectedCampaign;
        return matchesSearch && matchesCampaign;
    });

    const handleCampaignChange = (value: string) => {
        setSelectedCampaign(value);
        if (value === 'all') {
            router.visit('/reports');
        } else {
            router.visit(`/reports?campaign_id=${value}`);
        }
    };

    return (
        <>
            <Head title="Laporan Kampanye - Donamaha" />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-green-50/30">
                <Navbar />

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="to-primary-dark bg-gradient-to-r from-primary py-16 text-white">
                        <div className="container-custom">
                            <div className="max-w-3xl">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-4xl font-bold">
                                        Laporan Kampanye
                                    </h1>
                                </div>
                                <p className="text-xl text-white/90">
                                    Transparansi penggunaan dana donasi untuk
                                    setiap kampanye
                                </p>
                                <div className="mt-6 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span>{reports.length} Laporan</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        <span>
                                            {formatCurrency(
                                                reports.reduce(
                                                    (sum, r) =>
                                                        sum + r.total_spent,
                                                    0,
                                                ),
                                            )}{' '}
                                            Total Penggunaan
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Search & Filter Section */}
                    <section className="border-b bg-white py-8">
                        <div className="container-custom">
                            <div className="flex flex-col gap-4 md:flex-row">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari laporan..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>

                                {/* Campaign Filter */}
                                <div className="w-full md:w-64">
                                    <Select
                                        value={selectedCampaign}
                                        onValueChange={handleCampaignChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Filter Kampanye" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Kampanye
                                            </SelectItem>
                                            {campaigns.map((campaign) => (
                                                <SelectItem
                                                    key={campaign.id}
                                                    value={campaign.id.toString()}
                                                >
                                                    {campaign.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Results count */}
                            <p className="mt-4 text-sm text-gray-600">
                                Menampilkan {filteredReports.length} dari{' '}
                                {reports.length} laporan
                            </p>
                        </div>
                    </section>

                    {/* Reports Grid */}
                    <section className="py-12">
                        <div className="container-custom">
                            {filteredReports.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                        Tidak ada laporan
                                    </h3>
                                    <p className="text-gray-600">
                                        {search || selectedCampaign !== 'all'
                                            ? 'Tidak ada laporan yang sesuai dengan pencarian Anda'
                                            : 'Belum ada laporan yang dipublikasikan'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredReports.map((report) => (
                                        <Card
                                            key={report.id}
                                            className="shadow-card hover:shadow-hover group overflow-hidden transition-all duration-300"
                                        >
                                            {/* Image */}
                                            {report.image_path ? (
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={`/storage/${report.image_path}`}
                                                        alt={report.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <Badge className="border-0 bg-white/90 text-primary shadow-sm">
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            Laporan
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                    <FileText className="h-16 w-16 text-primary/30" />
                                                    <div className="absolute top-3 right-3">
                                                        <Badge className="border-0 bg-white/90 text-primary shadow-sm">
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            Laporan
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            <CardHeader>
                                                <CardTitle className="line-clamp-2 transition-colors group-hover:text-primary">
                                                    {report.title}
                                                </CardTitle>
                                                <CardDescription className="flex flex-col gap-2">
                                                    <Link
                                                        href={`/campaigns/${report.campaign.slug}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {report.campaign.title}
                                                    </Link>
                                                    <span className="text-xs text-gray-500">
                                                        Oleh{' '}
                                                        {report.author.name}
                                                    </span>
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent>
                                                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                                                    {report.content}
                                                </p>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            Dana Terpakai:
                                                        </span>
                                                        <span className="font-semibold text-primary">
                                                            {formatCurrency(
                                                                report.total_spent,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {formatDate(
                                                                report.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter>
                                                <Link
                                                    href={`/reports/${report.id}`}
                                                    className="w-full"
                                                >
                                                    <Button className="btn-shadow w-full bg-primary text-white hover:bg-primary/90">
                                                        Lihat Detail Laporan
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
