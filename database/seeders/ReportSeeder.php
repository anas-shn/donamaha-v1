<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Report;
use App\Models\Campaign;
use App\Models\User;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get campaigns and their organizers
        $campaigns = Campaign::with('organizer')->get();

        if ($campaigns->isEmpty()) {
            $this->command->warn('No campaigns found. Please seed campaigns first.');
            return;
        }

        $reportData = [
            [
                'title' => 'Laporan Penggunaan Dana Bulan Januari 2024',
                'content' => "Dengan penuh rasa syukur, kami melaporkan penggunaan dana donasi untuk bulan Januari 2024.\n\nRincian Penggunaan:\n- Pembelian bahan makanan: Rp 2.500.000\n- Distribusi paket sembako: Rp 1.500.000\n- Biaya operasional: Rp 500.000\n- Dokumentasi dan laporan: Rp 300.000\n\nTotal: Rp 4.800.000\n\nAlhamdulillah, dana yang terkumpul telah tersalurkan dengan baik kepada 150 keluarga yang membutuhkan. Terima kasih atas dukungan dan kepercayaan para donatur.",
                'total_spent' => 4800000,
            ],
            [
                'title' => 'Laporan Distribusi Bantuan Pendidikan',
                'content' => "Laporan kegiatan distribusi bantuan pendidikan untuk anak-anak kurang mampu.\n\nPenggunaan Dana:\n- Pembelian buku pelajaran: Rp 3.000.000\n- Seragam sekolah: Rp 2.000.000\n- Tas dan alat tulis: Rp 1.500.000\n- Biaya administrasi: Rp 500.000\n\nTotal: Rp 7.000.000\n\nSebanyak 80 anak telah menerima bantuan pendidikan lengkap untuk tahun ajaran baru. Semoga ini dapat membantu mereka menggapai cita-cita.",
                'total_spent' => 7000000,
            ],
            [
                'title' => 'Laporan Pembangunan Fasilitas Air Bersih',
                'content' => "Alhamdulillah, pembangunan fasilitas air bersih telah selesai dilaksanakan.\n\nRincian Biaya:\n- Material dan pompa air: Rp 8.000.000\n- Upah tukang dan instalasi: Rp 3.500.000\n- Pipa dan aksesoris: Rp 2.000.000\n- Biaya perizinan: Rp 500.000\n\nTotal: Rp 14.000.000\n\nFasilitas air bersih ini kini melayani 200 keluarga di desa terpencil. Air bersih yang mengalir 24 jam akan sangat membantu keseharian mereka.",
                'total_spent' => 14000000,
            ],
            [
                'title' => 'Laporan Bantuan Kesehatan Gratis',
                'content' => "Kegiatan pemeriksaan kesehatan gratis telah dilaksanakan dengan sukses.\n\nPenggunaan Dana:\n- Obat-obatan dan vitamin: Rp 4.000.000\n- Honor dokter dan paramedis: Rp 2.500.000\n- Alat kesehatan: Rp 1.500.000\n- Konsumsi dan operasional: Rp 1.000.000\n\nTotal: Rp 9.000.000\n\nSebanyak 300 pasien telah mendapatkan pelayanan kesehatan gratis. Terima kasih kepada tim medis yang telah berpartisipasi.",
                'total_spent' => 9000000,
            ],
            [
                'title' => 'Laporan Renovasi Rumah Dhuafa',
                'content' => "Program renovasi rumah tidak layak huni telah berhasil diselesaikan.\n\nDetail Pengeluaran:\n- Material bangunan: Rp 6.000.000\n- Upah tukang: Rp 3.000.000\n- Cat dan finishing: Rp 1.500.000\n- Biaya lain-lain: Rp 500.000\n\nTotal: Rp 11.000.000\n\nSebanyak 5 rumah keluarga dhuafa telah direnovasi dan kini layak huni. Semoga membawa berkah bagi penghuninya.",
                'total_spent' => 11000000,
            ],
            [
                'title' => 'Laporan Program Pelatihan Keterampilan',
                'content' => "Program pelatihan keterampilan untuk pemuda kurang mampu telah selesai dilaksanakan.\n\nAlokasi Dana:\n- Biaya instruktur: Rp 2.000.000\n- Bahan dan peralatan: Rp 2.500.000\n- Sertifikat dan modul: Rp 800.000\n- Konsumsi peserta: Rp 700.000\n\nTotal: Rp 6.000.000\n\n40 peserta telah mengikuti pelatihan jahit, elektronik, dan kuliner. Mereka kini memiliki keterampilan untuk berwirausaha.",
                'total_spent' => 6000000,
            ],
        ];

        foreach ($campaigns as $index => $campaign) {
            // Get report data cyclically
            $data = $reportData[$index % count($reportData)];

            Report::create([
                'campaign_id' => $campaign->id,
                'author_id' => $campaign->organizer_id,
                'title' => $data['title'],
                'content' => $data['content'],
                'total_spent' => $data['total_spent'],
                'image_path' => null, // Can be added later
                'published_at' => now()->subDays(rand(1, 30)),
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        $this->command->info('Reports seeded successfully!');
    }
}
