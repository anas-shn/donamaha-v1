import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    DollarSign,
    Facebook,
    FileText,
    Link2,
    Share2,
    Twitter,
    User,
} from 'lucide-react';

interface Campaign {
    id: number;
    title: string;
    slug: string;
    image_path: string | null;
    target_amount: number;
    current_amount: number;
}

interface Author {
    id: number;
    name: string;
    email: string;
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
    updated_at: string;
    campaign: Campaign;
    author: Author;
}

interface Props {
    report: Report;
}

export default function ReportShow({ report }: Props) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Lihat laporan: ${report.title} - Donamaha`;

    const handleShare = (platform: string) => {
        let url = '';
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(shareUrl);
                alert('Link berhasil disalin!');
                return;
        }
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    return (
        <>
            <Head title={`${report.title} - Laporan - Donamaha`} />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-green-50/30">
                <Navbar />

                <main className="flex-1">
                    {/* Back Button */}
                    <section className="border-b bg-white py-4">
                        <div className="container-custom">
                            <Link href="/reports">
                                <Button
                                    variant="ghost"
                                    className="gap-2 hover:bg-primary/5"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali ke Daftar Laporan
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* Hero Image Section */}
                    {report.image_path ? (
                        <section className="relative h-[400px] overflow-hidden">
                            <img
                                src={`/storage/${report.image_path}`}
                                alt={report.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute right-0 bottom-0 left-0 p-8">
                                <div className="container-custom">
                                    <Badge className="mb-4 border-0 bg-white/90 text-primary shadow-sm">
                                        <FileText className="mr-1 h-3 w-3" />
                                        Laporan Kampanye
                                    </Badge>
                                    <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
                                        {report.title}
                                    </h1>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="to-primary-dark bg-gradient-to-r from-primary py-16 text-white">
                            <div className="container-custom">
                                <Badge className="mb-4 border-0 bg-white/90 text-primary shadow-sm">
                                    <FileText className="mr-1 h-3 w-3" />
                                    Laporan Kampanye
                                </Badge>
                                <h1 className="mb-2 text-4xl font-bold">
                                    {report.title}
                                </h1>
                            </div>
                        </section>
                    )}

                    {/* Content Section */}
                    <section className="py-12">
                        <div className="container-custom">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Main Content */}
                                <div className="space-y-6 lg:col-span-2">
                                    {/* Meta Info Card */}
                                    <Card className="shadow-card">
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-primary/10 p-2">
                                                        <User className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Penulis
                                                        </p>
                                                        <p className="font-semibold">
                                                            {report.author.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-primary/10 p-2">
                                                        <Calendar className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Tanggal
                                                        </p>
                                                        <p className="font-semibold">
                                                            {formatDate(
                                                                report.created_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-primary/10 p-2">
                                                        <DollarSign className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Dana Terpakai
                                                        </p>
                                                        <p className="font-semibold text-primary">
                                                            {formatCurrency(
                                                                report.total_spent,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Report Content */}
                                    <Card className="shadow-card">
                                        <CardHeader>
                                            <div className="mb-2 flex items-center gap-2 text-primary">
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span className="text-sm font-medium">
                                                    Laporan Terverifikasi
                                                </span>
                                            </div>
                                            <CardTitle className="text-2xl">
                                                Detail Laporan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="prose max-w-none">
                                                <div
                                                    className="leading-relaxed whitespace-pre-wrap text-gray-700"
                                                    dangerouslySetInnerHTML={{
                                                        __html: report.content,
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Share Section */}
                                    <Card className="shadow-card">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Share2 className="h-5 w-5" />
                                                Bagikan Laporan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleShare('facebook')
                                                    }
                                                    className="gap-2"
                                                >
                                                    <Facebook className="h-4 w-4" />
                                                    Facebook
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleShare('twitter')
                                                    }
                                                    className="gap-2"
                                                >
                                                    <Twitter className="h-4 w-4" />
                                                    Twitter
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleShare('copy')
                                                    }
                                                    className="gap-2"
                                                >
                                                    <Link2 className="h-4 w-4" />
                                                    Salin Link
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Campaign Info Card */}
                                    <Card className="shadow-card sticky top-4">
                                        <CardHeader>
                                            <CardTitle>
                                                Kampanye Terkait
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {report.campaign.image_path && (
                                                <div className="relative h-40 overflow-hidden rounded-lg">
                                                    <img
                                                        src={`/storage/${report.campaign.image_path}`}
                                                        alt={
                                                            report.campaign
                                                                .title
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="mb-2 text-lg font-semibold">
                                                    {report.campaign.title}
                                                </h3>

                                                <Separator className="my-4" />

                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="mb-1 flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                Terkumpul
                                                            </span>
                                                            <span className="font-semibold text-primary">
                                                                {formatCurrency(
                                                                    report
                                                                        .campaign
                                                                        .current_amount,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                Target
                                                            </span>
                                                            <span className="font-semibold">
                                                                {formatCurrency(
                                                                    report
                                                                        .campaign
                                                                        .target_amount,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                                        <div
                                                            className="h-2 rounded-full bg-primary transition-all duration-300"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (report
                                                                        .campaign
                                                                        .current_amount /
                                                                        report
                                                                            .campaign
                                                                            .target_amount) *
                                                                        100,
                                                                    100,
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <p className="text-center text-xs text-gray-500">
                                                        {Math.round(
                                                            (report.campaign
                                                                .current_amount /
                                                                report.campaign
                                                                    .target_amount) *
                                                                100,
                                                        )}
                                                        % tercapai
                                                    </p>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/campaigns/${report.campaign.slug}`}
                                            >
                                                <Button className="btn-shadow w-full bg-primary text-white hover:bg-primary/90">
                                                    Lihat Kampanye
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                    {/* Quick Stats */}
                                    <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Statistik Penggunaan Dana
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Dana Terkumpul
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {formatCurrency(
                                                        report.campaign
                                                            .current_amount,
                                                    )}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Dana Terpakai
                                                </span>
                                                <span className="font-bold text-secondary">
                                                    {formatCurrency(
                                                        report.total_spent,
                                                    )}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Sisa Dana
                                                </span>
                                                <span className="font-bold text-green-600">
                                                    {formatCurrency(
                                                        report.campaign
                                                            .current_amount -
                                                            report.total_spent,
                                                    )}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Related Reports CTA */}
                    <section className="to-primary-dark bg-gradient-to-r from-primary py-12 text-white">
                        <div className="container-custom text-center">
                            <FileText className="mx-auto mb-4 h-12 w-12 opacity-90" />
                            <h2 className="mb-4 text-3xl font-bold">
                                Lihat Laporan Lainnya
                            </h2>
                            <p className="mx-auto mb-6 max-w-2xl text-white/90">
                                Transparansi adalah prioritas kami. Lihat
                                laporan penggunaan dana dari kampanye lainnya.
                            </p>
                            <Link href="/reports">
                                <Button
                                    size="lg"
                                    className="btn-shadow bg-white text-primary hover:bg-white/90"
                                >
                                    Lihat Semua Laporan
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
