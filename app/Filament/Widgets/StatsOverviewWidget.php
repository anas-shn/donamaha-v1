<?php

namespace App\Filament\Widgets;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Payment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalUsers = User::count();
        $totalCampaigns = Campaign::count();
        $activeCampaigns = Campaign::where('status', 'active')->count();
        $totalDonations = Donation::where('status', 'completed')->sum('amount');
        $totalDonationsCount = Donation::where('status', 'completed')->count();
        $pendingPayments = Payment::where('payment_status', 'pending')->count();
        $completedPayments = Payment::where('payment_status', 'completed')->count();

        return [
            Stat::make('Total Users', $totalUsers)
                ->description('Registered users')
                ->descriptionIcon('heroicon-m-users')
                ->color('success')
                ->chart([7, 12, 15, 18, 22, 25, $totalUsers]),

            Stat::make('Total Campaigns', $totalCampaigns)
                ->description($activeCampaigns.' active campaigns')
                ->descriptionIcon('heroicon-m-megaphone')
                ->color('primary')
                ->chart([3, 5, 8, 12, 15, 18, $totalCampaigns]),

            Stat::make('Total Donations', 'Rp '.number_format($totalDonations, 0, ',', '.'))
                ->description($totalDonationsCount.' completed donations')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('success')
                ->chart([100000, 250000, 400000, 650000, 900000, 1200000, $totalDonations]),

            Stat::make('Pending Payments', $pendingPayments)
                ->description($completedPayments.' completed')
                ->descriptionIcon('heroicon-m-credit-card')
                ->color('warning')
                ->chart([2, 4, 3, 5, 4, 6, $pendingPayments]),
        ];
    }
}
