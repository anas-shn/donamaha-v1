import { store } from '@/actions/App/Http/Controllers/CampaignController';
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
import { Textarea } from '@/components/ui/textarea';
import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, Calendar, DollarSign, Image, Upload } from 'lucide-react';
import { useState } from 'react';

export default function CreateCampaign() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Head title="Buat Kampanye Baru - Donamaha" />

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
                                Buat Kampanye Baru
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Lengkapi informasi kampanye donasi Anda dengan
                                detail yang jelas dan menarik
                            </p>
                        </div>

                        {/* Form */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle>Informasi Kampanye</CardTitle>
                                <CardDescription>
                                    Pastikan semua informasi akurat dan mudah
                                    dipahami oleh calon donatur
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...store.form()} className="space-y-6">
                                    {({ errors, processing, data }) => (
                                        <>
                                            {/* Title */}
                                            <div className="space-y-2">
                                                <Label htmlFor="title">
                                                    Judul Kampanye{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    placeholder="Contoh: Bantuan untuk Korban Banjir"
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

                                            {/* Description */}
                                            <div className="space-y-2">
                                                <Label htmlFor="full_description">
                                                    Deskripsi Lengkap{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Textarea
                                                    id="full_description"
                                                    name="full_description"
                                                    placeholder="Ceritakan detail kampanye Anda, tujuan donasi, dan bagaimana dana akan digunakan (minimal 100 karakter)..."
                                                    rows={8}
                                                    className={
                                                        errors.full_description
                                                            ? 'border-red-500'
                                                            : ''
                                                    }
                                                />
                                                {errors.full_description && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.full_description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Target Amount */}
                                            <div className="space-y-2">
                                                <Label htmlFor="target_amount">
                                                    Target Donasi{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        id="target_amount"
                                                        name="target_amount"
                                                        type="number"
                                                        placeholder="100000"
                                                        className={`pl-10 ${errors.target_amount ? 'border-red-500' : ''}`}
                                                        min="100000"
                                                        step="1000"
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Minimal Rp 100.000
                                                </p>
                                                {errors.target_amount && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.target_amount}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Date Range */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="start_date">
                                                        Tanggal Mulai{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id="start_date"
                                                            name="start_date"
                                                            type="date"
                                                            className={`pl-10 ${errors.start_date ? 'border-red-500' : ''}`}
                                                            min={
                                                                new Date()
                                                                    .toISOString()
                                                                    .split(
                                                                        'T',
                                                                    )[0]
                                                            }
                                                        />
                                                    </div>
                                                    {errors.start_date && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.start_date}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="end_date">
                                                        Tanggal Selesai{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <Input
                                                            id="end_date"
                                                            name="end_date"
                                                            type="date"
                                                            className={`pl-10 ${errors.end_date ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    {errors.end_date && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.end_date}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Image Upload */}
                                            <div className="space-y-2">
                                                <Label htmlFor="image">
                                                    Gambar Kampanye{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <div
                                                    className={`relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                                                        imagePreview
                                                            ? 'border-primary bg-primary/5'
                                                            : errors.image
                                                              ? 'border-red-500 bg-red-50'
                                                              : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
                                                    }`}
                                                >
                                                    {imagePreview ? (
                                                        <div className="relative h-full w-full">
                                                            <img
                                                                src={
                                                                    imagePreview
                                                                }
                                                                alt="Preview"
                                                                className="h-full w-full rounded-lg object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                size="sm"
                                                                className="absolute top-2 right-2"
                                                                onClick={() => {
                                                                    setImagePreview(
                                                                        null,
                                                                    );
                                                                }}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <label
                                                            htmlFor="image"
                                                            className="flex cursor-pointer flex-col items-center justify-center p-6 text-center"
                                                        >
                                                            <Upload className="mb-4 h-12 w-12 text-gray-400" />
                                                            <p className="mb-2 text-sm font-medium text-gray-700">
                                                                Klik untuk
                                                                upload gambar
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                PNG, JPG, JPEG,
                                                                atau WEBP
                                                                (maksimal 2MB)
                                                            </p>
                                                        </label>
                                                    )}
                                                    <input
                                                        id="image"
                                                        name="image"
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </div>
                                                {errors.image && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.image}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex items-center justify-end gap-4 border-t pt-6">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        window.history.back()
                                                    }
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-primary text-white hover:bg-primary/90"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                                            Menyimpan...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Image className="mr-2 h-4 w-4" />
                                                            Buat Kampanye
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="mt-6 border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <Image className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-blue-900">
                                            Tips Membuat Kampanye yang Menarik
                                        </h3>
                                        <ul className="space-y-1 text-sm text-blue-800">
                                            <li>
                                                • Gunakan judul yang jelas dan
                                                menyentuh hati
                                            </li>
                                            <li>
                                                • Jelaskan secara detail tujuan
                                                dan penggunaan dana
                                            </li>
                                            <li>
                                                • Upload gambar yang berkualitas
                                                dan relevan
                                            </li>
                                            <li>
                                                • Tetapkan target donasi yang
                                                realistis
                                            </li>
                                            <li>
                                                • Tentukan periode kampanye yang
                                                sesuai
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
