<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_organizers' => User::where('role', 'organizer')->count(),
            'total_regular_users' => User::where('role', 'user')->count(),

            'total_campaigns' => Campaign::count(),
            'active_campaigns' => Campaign::where('status', 'active')->count(),
            'completed_campaigns' => Campaign::where('status', 'completed')->count(),
            'draft_campaigns' => Campaign::where('status', 'draft')->count(),

            'total_donations' => Donation::where('status', 'completed')->sum('amount'),
            'total_donations_count' => Donation::where('status', 'completed')->count(),
            'pending_donations' => Donation::where('status', 'pending')->count(),
            'pending_donations_amount' => Donation::where('status', 'pending')->sum('amount'),

            'total_payments' => Payment::count(),
            'pending_payments' => Payment::where('payment_status', 'pending')->count(),
            'completed_payments' => Payment::where('payment_status', 'completed')->count(),
            'failed_payments' => Payment::where('payment_status', 'failed')->count(),
        ];

        // Recent activities
        $recent_donations = Donation::with(['campaign', 'donor'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'amount' => $donation->amount,
                    'donor_name' => $donation->donor ? $donation->donor->name : $donation->donor_name,
                    'campaign_title' => $donation->campaign->title,
                    'status' => $donation->status,
                    'created_at' => $donation->created_at->diffForHumans(),
                ];
            });

        $recent_campaigns = Campaign::with('organizer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'organizer_name' => $campaign->organizer->name,
                    'status' => $campaign->status,
                    'target_amount' => $campaign->target_amount,
                    'collected_amount' => $campaign->collected_amount,
                    'progress' => $campaign->target_amount > 0
                        ? round(($campaign->collected_amount / $campaign->target_amount) * 100, 2)
                        : 0,
                    'created_at' => $campaign->created_at->diffForHumans(),
                ];
            });

        // Chart data - donations per month (last 6 months)
        $donations_chart = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $donations_chart[] = [
                'month' => $month->format('M'),
                'amount' => Donation::where('status', 'completed')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->sum('amount'),
                'count' => Donation::where('status', 'completed')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        }

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats,
            'recent_donations' => $recent_donations,
            'recent_campaigns' => $recent_campaigns,
            'donations_chart' => $donations_chart,
        ]);
    }
}
