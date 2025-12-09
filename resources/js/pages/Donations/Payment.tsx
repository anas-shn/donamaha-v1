import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock,
    CreditCard,
    Info,
    Smartphone,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface Campaign {
    id: number;
    title: string;
    organizer: {
        name: string;
    };
}

interface Donation {
    id: number;
    amount: number;
    note: string;
    status: string;
    created_at: string;
    campaign: Campaign;
}

interface Props {
    donation: Donation;
}

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    fee: number;
    estimatedTime: string;
}

export default function PaymentPage({ donation }: Props) {
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'qris',
            name: 'QRIS',
            description:
                'Scan QR code dengan aplikasi e-wallet atau mobile banking',
            icon: <Smartphone className="h-6 w-6" />,
            fee: 0,
            estimatedTime: 'Instant',
        },
        {
            id: 'bank_transfer',
            name: 'Transfer Bank',
            description: 'Transfer ke rekening bank BCA, Mandiri, BNI, BRI',
            icon: <Building2 className="h-6 w-6" />,
            fee: 0,
            estimatedTime: '1-24 jam',
        },
        {
            id: 'ewallet_gopay',
            name: 'GoPay',
            description: 'Bayar menggunakan saldo GoPay',
            icon: <Wallet className="h-6 w-6" />,
            fee: 0,
            estimatedTime: 'Instant',
        },
        {
            id: 'ewallet_ovo',
            name: 'OVO',
            description: 'Bayar menggunakan saldo OVO',
            icon: <Wallet className="h-6 w-6" />,
            fee: 0,
            estimatedTime: 'Instant',
        },
        {
            id: 'ewallet_dana',
            name: 'DANA',
            description: 'Bayar menggunakan saldo DANA',
            icon: <Wallet className="h-6 w-6" />,
            fee: 0,
            estimatedTime: 'Instant',
        },
        {
            id: 'credit_card',
            name: 'Kartu Kredit/Debit',
            description: 'Visa, Mastercard, JCB',
            icon: <CreditCard className="h-6 w-6" />,
            fee: 0.029, // 2.9% fee
            estimatedTime: 'Instant',
        },
    ];

    const selectedPaymentMethod = paymentMethods.find(
        (m) => m.id === selectedMethod,
    );
    const adminFee = selectedPaymentMethod
        ? donation.amount * selectedPaymentMethod.fee
        : 0;
    const totalAmount = donation.amount + adminFee;

    const handlePayment = () => {
        if (!selectedMethod) {
            alert('Silakan pilih metode pembayaran');
            return;
        }

        if (!agreedToTerms) {
            alert('Silakan setujui syarat dan ketentuan');
            return;
        }

        setProcessing(true);

        // Submit payment with selected method
        router.post(
            `/donations/${donation.id}/process-payment`,
            {
                payment_method: selectedMethod,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Will redirect to payment gateway or confirmation page
                },
                onError: (errors) => {
                    console.error('Payment error:', errors);
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Pembayaran Donasi" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
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

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Payment Methods Section */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Pilih Metode Pembayaran
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih metode pembayaran yang paling
                                        sesuai untuk Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={selectedMethod}
                                        onValueChange={setSelectedMethod}
                                        className="space-y-3"
                                    >
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`relative flex cursor-pointer items-start rounded-lg border-2 p-4 transition-all ${
                                                    selectedMethod === method.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                                }`}
                                                onClick={() =>
                                                    setSelectedMethod(method.id)
                                                }
                                            >
                                                <RadioGroupItem
                                                    value={method.id}
                                                    id={method.id}
                                                    className="mt-1"
                                                />
                                                <div className="ml-3 flex flex-1 items-start gap-4">
                                                    <div className="flex-shrink-0 text-primary">
                                                        {method.icon}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <Label
                                                            htmlFor={method.id}
                                                            className="cursor-pointer text-base font-semibold"
                                                        >
                                                            {method.name}
                                                        </Label>
                                                        <p className="text-muted-foreground mt-1 text-sm">
                                                            {method.description}
                                                        </p>
                                                        <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {
                                                                    method.estimatedTime
                                                                }
                                                            </span>
                                                            {method.fee > 0 && (
                                                                <span className="text-orange-600 dark:text-orange-400">
                                                                    Biaya admin{' '}
                                                                    {(
                                                                        method.fee *
                                                                        100
                                                                    ).toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Terms and Conditions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) =>
                                                setAgreedToTerms(
                                                    e.target.checked,
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        <Label
                                            htmlFor="terms"
                                            className="cursor-pointer text-sm"
                                        >
                                            Saya setuju dengan{' '}
                                            <a
                                                href="/terms"
                                                className="text-primary hover:underline"
                                            >
                                                syarat dan ketentuan
                                            </a>{' '}
                                            yang berlaku dan memahami bahwa
                                            donasi yang telah dibayarkan tidak
                                            dapat dikembalikan.
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Ringkasan Donasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Campaign Info */}
                                    <div>
                                        <p className="text-muted-foreground mb-1 text-sm">
                                            Campaign
                                        </p>
                                        <p className="font-semibold">
                                            {donation.campaign.title}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Oleh{' '}
                                            {donation.campaign.organizer.name}
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Amount Details */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Jumlah Donasi
                                            </span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    donation.amount,
                                                )}
                                            </span>
                                        </div>
                                        {adminFee > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Biaya Admin
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(adminFee)}
                                                </span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="font-semibold">
                                                Total Pembayaran
                                            </span>
                                            <span className="text-lg font-bold text-primary">
                                                {formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {donation.note && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-muted-foreground mb-1 text-sm">
                                                    Catatan
                                                </p>
                                                <p className="text-sm">
                                                    {donation.note}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <Separator />

                                    {/* Transaction Info */}
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
                                </CardContent>
                                <CardFooter className="flex flex-col gap-3">
                                    <Button
                                        onClick={handlePayment}
                                        disabled={
                                            !selectedMethod ||
                                            !agreedToTerms ||
                                            processing
                                        }
                                        className="w-full"
                                        size="lg"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Bayar{' '}
                                                {formatCurrency(totalAmount)}
                                            </>
                                        )}
                                    </Button>

                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertDescription className="text-xs">
                                            Pembayaran Anda akan diproses dengan
                                            aman melalui gateway pembayaran
                                            terpercaya.
                                        </AlertDescription>
                                    </Alert>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
