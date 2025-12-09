import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock,
    Copy,
    Info,
    RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

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

const bankAccounts = [
    {
        bank: 'BCA',
        accountNumber: '1234567890',
        accountName: 'Yayasan Donamaha',
    },
    {
        bank: 'Mandiri',
        accountNumber: '0987654321',
        accountName: 'Yayasan Donamaha',
    },
    {
        bank: 'BNI',
        accountNumber: '5555666677',
        accountName: 'Yayasan Donamaha',
    },
    {
        bank: 'BRI',
        accountNumber: '8888999900',
        accountName: 'Yayasan Donamaha',
    },
];

export default function PaymentPending({ donation }: Props) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleCheckStatus = () => {
        router.reload({ only: ['donation'] });
    };

    const getPaymentInstructions = () => {
        if (!donation.payment) return null;

        const method = donation.payment.payment_method;

        if (method === 'bank_transfer') {
            return (
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">
                            Cara Transfer Bank:
                        </h3>
                        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                            <li>Pilih salah satu rekening bank di bawah ini</li>
                            <li>
                                Transfer sejumlah{' '}
                                {formatCurrency(donation.amount)}
                            </li>
                            <li>Simpan bukti transfer</li>
                            <li>
                                Sistem akan memverifikasi pembayaran Anda dalam
                                1x24 jam
                            </li>
                        </ol>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="font-semibold">Pilih Bank Tujuan:</h4>
                        {bankAccounts.map((account, idx) => (
                            <Card key={idx} className="border-2">
                                <CardContent className="pt-4">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-primary" />
                                            <span className="text-lg font-bold">
                                                {account.bank}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                                            <div>
                                                <p className="text-muted-foreground mb-1 text-xs">
                                                    Nomor Rekening
                                                </p>
                                                <p className="font-mono text-lg font-semibold">
                                                    {account.accountNumber}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        account.accountNumber,
                                                        `account-${idx}`,
                                                    )
                                                }
                                            >
                                                {copiedField ===
                                                `account-${idx}` ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                                            <p className="text-muted-foreground mb-1 text-xs">
                                                Atas Nama
                                            </p>
                                            <p className="font-semibold">
                                                {account.accountName}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        if (method === 'qris') {
            return (
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">
                            Cara Bayar dengan QRIS:
                        </h3>
                        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                            <li>
                                Buka aplikasi e-wallet atau mobile banking Anda
                            </li>
                            <li>Pilih menu "Scan QR" atau "Bayar dengan QR"</li>
                            <li>Scan kode QR di bawah ini</li>
                            <li>Pastikan jumlah pembayaran sesuai</li>
                            <li>Konfirmasi pembayaran</li>
                        </ol>
                    </div>

                    <Separator />

                    <div className="flex justify-center rounded-lg bg-white p-8 dark:bg-gray-800">
                        <div className="text-center">
                            <div className="mb-4 flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                                <p className="text-muted-foreground">
                                    QR Code Placeholder
                                </p>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Scan kode QR ini dengan aplikasi pembayaran Anda
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (method.startsWith('ewallet_')) {
            const walletName = paymentMethodNames[method];
            return (
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">
                            Cara Bayar dengan {walletName}:
                        </h3>
                        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
                            <li>Buka aplikasi {walletName} Anda</li>
                            <li>Masukkan nomor referensi pembayaran</li>
                            <li>Pastikan jumlah pembayaran sesuai</li>
                            <li>Konfirmasi pembayaran</li>
                        </ol>
                    </div>

                    <Separator />

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <p className="text-muted-foreground mb-2 text-xs">
                            Nomor Referensi
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-xl font-semibold">
                                DN{donation.id.toString().padStart(10, '0')}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    copyToClipboard(
                                        `DN${donation.id.toString().padStart(10, '0')}`,
                                        'reference',
                                    )
                                }
                            >
                                {copiedField === 'reference' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="py-8 text-center">
                <p className="text-muted-foreground">
                    Ikuti instruksi pembayaran yang dikirimkan ke email Anda
                </p>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Menunggu Pembayaran" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-4xl">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.visit('/donations')}
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Riwayat Donasi
                    </Button>

                    {/* Status Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <Clock className="h-12 w-12 animate-pulse text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Menunggu Pembayaran
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Silakan selesaikan pembayaran Anda
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Payment Instructions */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Instruksi Pembayaran</CardTitle>
                                    <CardDescription>
                                        {donation.payment &&
                                            `Metode pembayaran: ${paymentMethodNames[donation.payment.payment_method] || donation.payment.payment_method}`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {getPaymentInstructions()}
                                </CardContent>
                            </Card>

                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Penting!</AlertTitle>
                                <AlertDescription>
                                    Pastikan jumlah transfer sesuai dengan
                                    nominal yang tertera. Jika terjadi perbedaan
                                    nominal, pembayaran mungkin tidak
                                    terverifikasi secara otomatis.
                                </AlertDescription>
                            </Alert>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Detail Donasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-muted-foreground mb-1 text-sm">
                                            Campaign
                                        </p>
                                        <p className="font-semibold">
                                            {donation.campaign.title}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground text-sm">
                                            Jumlah Donasi
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            {formatCurrency(donation.amount)}
                                        </span>
                                    </div>

                                    <Separator />

                                    <div className="text-muted-foreground space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span>ID Donasi</span>
                                            <span className="font-mono">
                                                #{donation.id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tanggal</span>
                                            <span>
                                                {formatDate(
                                                    donation.created_at,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <Button
                                        onClick={handleCheckStatus}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Cek Status Pembayaran
                                    </Button>
                                </CardContent>
                            </Card>

                            <Alert className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10">
                                <Clock className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    Verifikasi pembayaran otomatis membutuhkan
                                    waktu hingga 24 jam untuk transfer bank, dan
                                    instant untuk metode pembayaran lainnya.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
