import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CreditCard,
    Heart,
    Info,
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
    note: string | null;
    status: string;
    created_at: string;
    campaign: Campaign;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    donation: Donation;
    auth?: {
        user: User;
    };
}

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    group: string;
}

export default function PaymentPage({ donation, auth }: Props) {
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const { data, setData, errors } = useForm({
        donor_name: auth?.user?.name || '',
        donor_email: auth?.user?.email || '',
        note: donation.note || '',
        is_anonymous: false,
    });

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'bank_transfer',
            name: 'Transfer Bank',
            description: 'BCA, Mandiri, BRI, BNI',
            icon: <Building2 className="h-5 w-5" />,
            group: 'transfer',
        },
        {
            id: 'ewallet',
            name: 'E-Wallet',
            description: 'GoPay, OVO, DANA, ShopeePay',
            icon: <Wallet className="h-5 w-5" />,
            group: 'ewallet',
        },
        {
            id: 'credit_card',
            name: 'Kartu Kredit/Debit',
            description: 'Visa, Mastercard',
            icon: <CreditCard className="h-5 w-5" />,
            group: 'card',
        },
    ];

    // Calculate admin fee (2.5%)
    const adminFeePercentage = 0.025;
    const adminFee = Math.ceil(donation.amount * adminFeePercentage);
    const totalAmount = donation.amount + adminFee;

    const handlePayment = () => {
        if (!selectedMethod) {
            alert('Silakan pilih metode pembayaran');
            return;
        }

        if (!isAnonymous && !data.donor_name.trim()) {
            alert('Silakan masukkan nama Anda');
            return;
        }

        setProcessing(true);

        // Submit payment with donor data and selected method
        router.post(
            `/donations/${donation.id}/process-payment`,
            {
                payment_method: selectedMethod,
                donor_name: isAnonymous ? 'Hamba Allah' : data.donor_name,
                donor_email: data.donor_email,
                note: data.note,
                is_anonymous: isAnonymous,
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
        <>
            <Head title="Pembayaran Donasi" />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left Column - Donor Data & Payment Methods */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Donor Data Card */}
                            <Card className="border-green-200">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-green-600" />
                                        <CardTitle>Data Donatur</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="donor_name">
                                            Nama Lengkap{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="donor_name"
                                            placeholder="Masukkan nama Anda"
                                            value={data.donor_name}
                                            onChange={(e) =>
                                                setData(
                                                    'donor_name',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={isAnonymous}
                                            className="bg-white"
                                        />
                                        {errors.donor_name && (
                                            <p className="text-sm text-red-500">
                                                {errors.donor_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field (Optional) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="donor_email">
                                            Email (opsional)
                                        </Label>
                                        <Input
                                            id="donor_email"
                                            type="email"
                                            placeholder="email@contoh.com"
                                            value={data.donor_email}
                                            onChange={(e) =>
                                                setData(
                                                    'donor_email',
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-white"
                                        />
                                    </div>

                                    {/* Message/Prayer Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="note">
                                            Pesan/Doa (opsional)
                                        </Label>
                                        <Textarea
                                            id="note"
                                            placeholder="Tulis pesan atau doa untuk penerima donasi..."
                                            value={data.note}
                                            onChange={(e) =>
                                                setData('note', e.target.value)
                                            }
                                            rows={4}
                                            className="resize-none bg-white"
                                        />
                                    </div>

                                    {/* Anonymous Checkbox */}
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="anonymous"
                                            checked={isAnonymous}
                                            onCheckedChange={(checked) => {
                                                setIsAnonymous(
                                                    checked as boolean,
                                                );
                                                setData(
                                                    'is_anonymous',
                                                    checked as boolean,
                                                );
                                                if (checked) {
                                                    setData(
                                                        'donor_name',
                                                        'Hamba Allah',
                                                    );
                                                } else if (auth?.user) {
                                                    setData(
                                                        'donor_name',
                                                        auth.user.name,
                                                    );
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="anonymous"
                                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Sembunyikan nama saya (donasi
                                            anonim)
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Methods Card */}
                            <Card className="border-green-200">
                                <CardHeader>
                                    <CardTitle>Metode Pembayaran</CardTitle>
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
                                                className={`relative flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all ${
                                                    selectedMethod === method.id
                                                        ? 'border-green-500 bg-green-50 ring-2 ring-green-500'
                                                        : 'border-gray-200 hover:border-green-300'
                                                }`}
                                                onClick={() =>
                                                    setSelectedMethod(method.id)
                                                }
                                            >
                                                <RadioGroupItem
                                                    value={method.id}
                                                    id={method.id}
                                                    className="text-green-600"
                                                />
                                                <div className="flex flex-1 items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                                        {method.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={method.id}
                                                            className="cursor-pointer font-semibold"
                                                        >
                                                            {method.name}
                                                        </Label>
                                                        <p className="text-sm text-gray-600">
                                                            {method.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>

                                    {selectedMethod && (
                                        <Alert className="mt-4 border-blue-200 bg-blue-50">
                                            <Info className="h-4 w-4 text-blue-600" />
                                            <AlertDescription className="text-sm text-blue-800">
                                                Anda akan diarahkan ke halaman
                                                pembayaran setelah menekan
                                                tombol "Lanjut ke Pembayaran"
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Payment Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8 border-green-200">
                                <CardHeader>
                                    <CardTitle>Ringkasan Pembayaran</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Campaign Info */}
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            Kampanye
                                        </p>
                                        <p className="font-semibold">
                                            {donation.campaign.title}
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Amount Breakdown */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">
                                                Nominal Donasi
                                            </span>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    donation.amount,
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">
                                                Biaya Admin (2.5%)
                                            </span>
                                            <span className="font-medium">
                                                {formatCurrency(adminFee)}
                                            </span>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between text-lg">
                                            <span className="font-bold">
                                                Total Pembayaran
                                            </span>
                                            <span className="font-bold text-green-600">
                                                {formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Payment Button */}
                                    <Button
                                        onClick={handlePayment}
                                        disabled={
                                            !selectedMethod ||
                                            processing ||
                                            (!isAnonymous &&
                                                !data.donor_name.trim())
                                        }
                                        className="w-full bg-green-600 text-white hover:bg-green-700"
                                        size="lg"
                                    >
                                        {processing
                                            ? 'Memproses...'
                                            : 'Lanjut ke Pembayaran'}
                                    </Button>

                                    {/* Info Alert */}
                                    <Alert className="border-gray-200">
                                        <Info className="h-4 w-4" />
                                        <AlertDescription className="text-xs text-gray-600">
                                            Dengan melanjutkan, Anda menyetujui
                                            syarat dan ketentuan yang berlaku
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
