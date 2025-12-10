<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create or update admin user
        User::updateOrCreate(
            ['email' => 'admin@donamaha.com'],
            [
                'name' => 'Admin Donamaha',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'nim' => null,
                'avatar' => null,
                'email_verified_at' => now(),
            ]
        );

        // Create or update organizer user
        User::updateOrCreate(
            ['email' => 'organizer@donamaha.com'],
            [
                'name' => 'Organizer Demo',
                'password' => Hash::make('password'),
                'role' => 'organizer',
                'nim' => 'ORG001',
                'avatar' => null,
                'email_verified_at' => now(),
            ]
        );

        // Create or update regular user
        User::updateOrCreate(
            ['email' => 'user@donamaha.com'],
            [
                'name' => 'User Demo',
                'password' => Hash::make('password'),
                'role' => 'user',
                'nim' => 'USR001',
                'avatar' => null,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✓ Admin users created/updated successfully!');
        $this->command->info('');
        $this->command->info('Login credentials:');
        $this->command->info('─────────────────────────────────────────');
        $this->command->info('Admin    : admin@donamaha.com / password');
        $this->command->info('Organizer: organizer@donamaha.com / password');
        $this->command->info('User     : user@donamaha.com / password');
        $this->command->info('─────────────────────────────────────────');
    }
}
