<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create users first if they don't exist
        $organizer1 = User::firstOrCreate(
            ['email' => 'organizer1@example.com'],
            [
                'name' => 'Ahmad Fauzi',
                'password' => bcrypt('password'),
                'role' => 'organizer',
                'nim' => '2021001',
            ]
        );

        $organizer2 = User::firstOrCreate(
            ['email' => 'organizer2@example.com'],
            [
                'name' => 'Siti Nurhaliza',
                'password' => bcrypt('password'),
                'role' => 'organizer',
                'nim' => '2021002',
            ]
        );

        $organizer3 = User::firstOrCreate(
            ['email' => 'organizer3@example.com'],
            [
                'name' => 'Budi Santoso',
                'password' => bcrypt('password'),
                'role' => 'organizer',
                'nim' => '2021003',
            ]
        );

        // Create campaigns
        $campaigns = [
            [
                'organizer_id' => $organizer1->id,
                'title' => 'Bantu Mahasiswa Terdampak Bencana Alam',
                'full_description' => 'Kampanye ini dibuat untuk membantu mahasiswa yang terkena dampak bencana alam. Dana yang terkumpul akan digunakan untuk kebutuhan sehari-hari, biaya kuliah, dan perlengkapan kuliah yang hilang. Mari bersama-sama membantu mereka untuk bisa melanjutkan pendidikan.',
                'target_amount' => 50000000,
                'collected_amount' => 15000000,
                'status' => 'active',
                'start_date' => now(),
                'end_date' => now()->addMonths(3),
            ],
            [
                'organizer_id' => $organizer2->id,
                'title' => 'Dana Pendidikan untuk Mahasiswa Kurang Mampu',
                'full_description' => 'Program beasiswa untuk mahasiswa berprestasi dari keluarga kurang mampu. Dana akan digunakan untuk biaya kuliah semester, buku, dan kebutuhan akademik lainnya. Setiap bantuan sangat berarti untuk masa depan mereka.',
                'target_amount' => 30000000,
                'collected_amount' => 22000000,
                'status' => 'active',
                'start_date' => now()->subMonth(),
                'end_date' => now()->addMonths(2),
            ],
            [
                'organizer_id' => $organizer3->id,
                'title' => 'Bantuan Laptop untuk Mahasiswa',
                'full_description' => 'Banyak mahasiswa yang kesulitan mengikuti kuliah online karena tidak memiliki laptop. Kampanye ini bertujuan untuk mengumpulkan dana pembelian laptop bekas berkualitas untuk mahasiswa yang membutuhkan.',
                'target_amount' => 20000000,
                'collected_amount' => 8000000,
                'status' => 'active',
                'start_date' => now()->subWeeks(2),
                'end_date' => now()->addMonth(),
            ],
            [
                'organizer_id' => $organizer1->id,
                'title' => 'Bantu Mahasiswa Sakit Kronis',
                'full_description' => 'Mahasiswa kami sedang berjuang melawan penyakit kronis dan membutuhkan biaya pengobatan yang tidak sedikit. Mari kita bantu meringankan beban biaya pengobatan agar dia bisa sembuh dan melanjutkan kuliah.',
                'target_amount' => 75000000,
                'collected_amount' => 45000000,
                'status' => 'active',
                'start_date' => now()->subMonths(2),
                'end_date' => now()->addMonths(4),
            ],
            [
                'organizer_id' => $organizer2->id,
                'title' => 'Dana Riset Mahasiswa',
                'full_description' => 'Mahasiswa tingkat akhir membutuhkan dana untuk penelitian skripsi/thesis. Dana akan digunakan untuk biaya riset, survei, pengolahan data, dan publikasi hasil penelitian.',
                'target_amount' => 15000000,
                'collected_amount' => 12000000,
                'status' => 'active',
                'start_date' => now()->subWeeks(3),
                'end_date' => now()->addWeeks(6),
            ],
            [
                'organizer_id' => $organizer3->id,
                'title' => 'Bantuan Kebutuhan Pokok Mahasiswa',
                'full_description' => 'Kampanye untuk membantu mahasiswa yang kesulitan memenuhi kebutuhan pokok sehari-hari seperti makan, tempat tinggal, dan transportasi. Bantuan ini sangat berarti untuk kelangsungan pendidikan mereka.',
                'target_amount' => 25000000,
                'collected_amount' => 18000000,
                'status' => 'active',
                'start_date' => now()->subWeek(),
                'end_date' => now()->addMonths(2),
            ],
        ];

        foreach ($campaigns as $campaign) {
            Campaign::create($campaign);
        }
    }
}
