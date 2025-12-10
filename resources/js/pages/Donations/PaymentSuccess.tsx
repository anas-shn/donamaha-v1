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
import { Separator } from '@/components/ui/separator';

import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Home,
    Receipt,
    Share2,
} from 'lucide-react';

interface Campaign {
    id: number;
    title: string;
    organizer: {
        name: string;
    };
}

interface Payment {
    id: number;
    payment_method: string;
    payment_status: string;
    paid_at: string;
}

interface Donation {
    id: number;
    amount: number;
    note: string;
    status: string;
    created_at: string;
    campaign: Campaign;
    payment?: Payment;
}

interface Props {
    donation: Donation;
}

const paymentMethodNames: Record<string, string> = {
    qris: 'QRIS',
    bank_transfer: 'Transfer Bank',
    ewallet_gopay: 'GoPay',
    ewallet_ovo: 'OVO',
    ewallet_dana: 'DANA',
    credit_card: 'Kartu Kredit/Debit',
};

export default function PaymentSuccess({ donation }: Props) {
    const handleDownloadReceipt = () => {
        // TODO: Implement PDF receipt generation
        router.get(
            `/donations/${donation.id}/receipt`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleShare = () => {
        const shareText = `Saya baru saja berdonasi untuk "${donation.campaign.title}" di Donamaha! Mari kita bantu bersama! 💙`;
        const shareUrl =
            window.location.origin + `/campaigns/${donation.campaign.id}`;

        if (navigator.share) {
            navigator
                .share({
                    title: 'Donasi Saya',
                    text: shareText,
                    url: shareUrl,
                })
                .catch((err) => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            alert('Link berhasil disalin ke clipboard!');
        }
    };

    return (
        <>
            <Head title="Pembayaran Berhasil" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    {/* Success Icon & Message */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Pembayaran Berhasil!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Terima kasih atas donasi Anda. Semoga berkah dan
                            membawa manfaat.
                        </p>
                    </div>

                    {/* Receipt Card */}
                    <Card className="mb-6">
                        <CardHeader className="border-b text-center">
                            <div className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
                                <Receipt className="h-5 w-5" />
                                <CardDescription>
                                    Bukti Pembayaran
                                </CardDescription>
                            </div>
                            <CardTitle className="text-2xl text-primary">
                                {formatCurrency(donation.amount)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {/* Donation Details */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        Campaign
                                    </span>
                                    <span className="max-w-[60%] text-right text-sm font-semibold">
                                        {donation.campaign.title}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        Penyelenggara
                                    </span>
                                    <span className="text-sm font-medium">
                                        {donation.campaign.organizer.name}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        Tanggal Donasi
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatDate(donation.created_at)}
                                    </span>
                                </div>

                                {donation.payment && (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <span className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4" />
                                                Metode Pembayaran
                                            </span>
                                            <span className="text-sm font-medium">
                                                {paymentMethodNames[
                                                    donation.payment
                                                        .payment_method
                                                ] ||
                                                    donation.payment
                                                        .payment_method}
                                            </span>
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <span className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4" />
                                                Waktu Pembayaran
                                            </span>
                                            <span className="text-sm font-medium">
                                                {formatDate(
                                                    donation.payment.paid_at,
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <Separator />

                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        ID Transaksi
                                    </span>
                                    <span className="font-mono text-sm font-medium">
                                        #
                                        {donation.id
                                            .toString()
                                            .padStart(8, '0')}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground text-sm">
                                        Status
                                    </span>
                                    <Badge
                                        variant="success"
                                        className="bg-green-100 text-green-800"
                                    >
                                        {donation.status === 'paid'
                                            ? 'Lunas'
                                            : donation.status}
                                    </Badge>
                                </div>

                                {donation.note && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-muted-foreground mb-1 text-sm">
                                                Catatan
                                            </p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm">
                                                {donation.note}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                            <Button
                                onClick={handleDownloadReceipt}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Unduh Bukti
                            </Button>
                            <Button
                                onClick={handleShare}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Bagikan
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button
                            onClick={() => router.visit('/donations')}
                            variant="outline"
                            size="lg"
                            className="w-full"
                        >
                            <Receipt className="mr-2 h-4 w-4" />
                            Lihat Riwayat Donasi
                        </Button>
                        <Button
                            onClick={() => router.visit('/')}
                            size="lg"
                            className="w-full"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Kembali ke Beranda
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <Card className="mt-6 border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold text-blue-900">
                                        Donasi Anda Telah Diterima
                                    </h3>
                                    <p className="text-sm text-blue-800">
                                        Donasi Anda akan segera disalurkan
                                        kepada penerima manfaat. Anda akan
                                        menerima email konfirmasi dan update
                                        perkembangan campaign ini.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
