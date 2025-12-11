import { store } from '@/actions/App/Http/Controllers/ReportController';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    DollarSign,
    FileText,
    Image as ImageIcon,
    Upload,
} from 'lucide-react';
import { useState } from 'react';

interface Campaign {
    id: number;
    title: string;
    organizer_id: number;
    collected_amount: number;
    target_amount: number;
}

interface Props {
    campaign?: Campaign;
    campaigns: Campaign[];
}

export default function CreateReport({ campaign, campaigns }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedCampaignId, setSelectedCampaignId] = useState<
        string | undefined
    >(campaign?.id.toString());

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (2MB max)
            if (file.size > 2048 * 1024) {
                alert('Ukuran gambar tidak boleh lebih dari 2MB');
                e.target.value = '';
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Format gambar harus jpeg, jpg, png, atau webp');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectedCampaign = campaigns.find(
        (c) => c.id.toString() === selectedCampaignId
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title="Buat Laporan - Donamaha" />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-green-50/30">
                <Navbar />

                <main className="flex-1 py-12">
                    <div className="container-custom max-w-4xl">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                className="mb-4"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Buat Laporan Kampanye
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Buat laporan penggunaan dana untuk memberikan
                                transparansi kepada donatur
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Form */}
                            <div className="lg:col-span-2">
                                <Card className="shadow-card">
                                    <CardHeader>
                                        <CardTitle>Informasi Laporan</CardTitle>
                                        <CardDescription>
                                            Lengkapi detail laporan penggunaan
                                            dana dengan jelas dan transparan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Form
                                            {...store.form()}
                                            className="space-y-6"
                                        >
                                            {({ errors, processing }) => (
                                                <>
                                                    {/* Campaign Selection */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="campaign_id">
                                                            Kampanye{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <input
                                                            type="hidden"
                                                            name="campaign_id"
                                                            value={
                                                                selectedCampaignId ||
                                                                ''
                                                            }
                                                        />
                                                        <Select
                                                            value={
                                                                selectedCampaignId
                                                            }
                                                            onValueChange={
                                                                setSelectedCampaignId
                                                            }
                                                            disabled={
                                                                !!campaign
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={
                                                                    errors.campaign_id
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            >
                                                                <SelectValue placeholder="Pilih kampanye" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {campaigns.map(
                                                                    (c) => (
                                                                        <SelectItem
                                                                            key={
                                                                                c.id
                                                                            }
                                                                            value={c.id.toString()}
                                                                        >
                                                                            {
                                                                                c.title
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.campaign_id && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors.campaign_id
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">
                                                            Judul Laporan{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            id="title"
                                                            name="title"
                                                            type="text"
                                                            placeholder="Contoh: Laporan Penggunaan Dana Bulan Januari 2024"
                                                            className={
                                                                errors.title
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }
                                                        />
                                                        {errors.title && (
                                                            <p className="text-sm text-red-500">
                                                                {errors.title}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Total Spent */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="total_spent">
                                                            Total Dana
                                                            Digunakan{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                            <Input
                                                                id="total_spent"
                                                                name="total_spent"
                                                                type="number"
                                                                min="0"
                                                                step="1000"
                                                                placeholder="0"
                                                                className={`pl-10 ${errors.total_spent ? 'border-red-500' : ''}`}
                                                            />
                                                        </div>
                                                        {errors.total_spent && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors.total_spent
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            Masukkan jumlah dana
                                                            yang telah digunakan
                                                            dalam rupiah
                                                        </p>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="content">
                                                            Konten Laporan{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </Label>
                                                        <Textarea
                                                            id="content"
                                                            name="content"
                                                            rows={12}
                                                            placeholder="Jelaskan secara detail penggunaan dana, kegiatan yang dilakukan, dan dampak yang dihasilkan..."
                                                            className={
                                                                errors.content
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }
                                                        />
                                                        {errors.content && (
                                                            <p className="text-sm text-red-500">
                                                                {errors.content}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            Minimal 100 karakter
                                                        </p>
                                                    </div>

                                                    {/* Image Upload */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="image">
                                                            Gambar Dokumentasi
                                                        </Label>
                                                        <div className="space-y-4">
                                                            {imagePreview ? (
                                                                <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
                                                                    <img
                                                                        src={
                                                                            imagePreview
                                                                        }
                                                                        alt="Preview"
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        className="absolute right-2 top-2"
                                                                        onClick={() => {
                                                                            setImagePreview(
                                                                                null
                                                                            );
                                                                            const input =
                                                                                document.getElementById(
                                                                                    'image'
                                                                                ) as HTMLInputElement;
                                                                            if (
                                                                                input
                                                                            )
                                                                                input.value =
                                                                                    '';
                                                                        }}
                                                                    >
                                                                        Hapus
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <label
                                                                    htmlFor="image"
                                                                    className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                                                                >
                                                                    <Upload className="mb-2 h-12 w-12 text-gray-400" />
                                                                    <p className="mb-1 text-sm font-medium text-gray-700">
                                                                        Klik
                                                                        untuk
                                                                        upload
                                                                        gambar
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        PNG,
                                                                        JPG,
                                                                        JPEG,
                                                                        WEBP
                                                                        (Max.
                                                                        2MB)
                                                                    </p>
                                                                </label>
                                                            )}
                                                            <Input
                                                                id="image"
                                                                name="image"
                                                                type="file"
                                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                                className="hidden"
                                                                onChange={
                                                                    handleImageChange
                                                                }
                                                            />
                                                            {errors.image && (
                                                                <p className="text-sm text-red-500">
                                                                    {
                                                                        errors.image
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Submit Button */}
                                                    <div className="flex gap-4 pt-4">
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="flex-1"
                                                        >
                                                            {processing ? (
                                                                <>
                                                                    <svg
                                                                        className="mr-2 h-4 w-4 animate-spin"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <circle
                                                                            className="opacity-25"
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="10"
                                                                            stroke="currentColor"
                                                                            strokeWidth="4"
                                                                        />
                                                                        <path
                                                                            className="opacity-75"
                                                                            fill="currentColor"
                                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                        />
                                                                    </svg>
                                                                    Menyimpan...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    Buat
                                                                    Laporan
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                window.history.back()
                                                            }
                                                        >
                                                            Batal
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Campaign Info */}
                                {selectedCampaign && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Info Kampanye
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {selectedCampaign.title}
                                                </p>
                                            </div>
                                            <div className="space-y-2 rounded-lg bg-green-50 p-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Dana Terkumpul
                                                    </span>
                                                    <span className="font-semibold text-green-600">
                                                        {formatCurrency(
                                                            selectedCampaign.collected_amount
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        Target Dana
                                                    </span>
                                                    <span className="font-medium text-gray-700">
                                                        {formatCurrency(
                                                            selectedCampaign.target_amount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Tips Card */}
                                <Card className="border-blue-200 bg-blue-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base text-blue-900">
                                            <AlertCircle className="h-5 w-5" />
                                            Tips Laporan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 text-sm text-blue-800">
                                            <li className="flex gap-2">
                                                <span className="text-blue-600">
                                                    •
                                                </span>
                                                <span>
                                                    Jelaskan detail penggunaan
                                                    dana dengan transparan
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-600">
                                                    •
                                                </span>
                                                <span>
                                                    Sertakan dokumentasi foto
                                                    untuk meningkatkan
                                                    kredibilitas
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-600">
                                                    •
                                                </span>
                                                <span>
                                                    Sebutkan dampak yang
                                                    dihasilkan dari kampanye
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-600">
                                                    •
                                                </span>
                                                <span>
                                                    Gunakan bahasa yang mudah
                                                    dipahami donatur
                                                </span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Report Structure Guide */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <ImageIcon className="h-5 w-5" />
                                            Struktur Laporan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    1.
                                                </span>
                                                <span>
                                                    Ringkasan kegiatan yang
                                                    dilakukan
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    2.
                                                </span>
                                                <span>
                                                    Rincian penggunaan dana
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    3.
                                                </span>
                                                <span>
                                                    Penerima manfaat/dampak
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    4.
                                                </span>
                                                <span>
                                                    Tantangan yang dihadapi
                                                </span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    5.
                                                </span>
                                                <span>
                                                    Rencana tindak lanjut
                                                </span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
