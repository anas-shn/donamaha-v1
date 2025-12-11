<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $campaigns = \App\Models\Campaign::with('organizer')
        ->where('status', 'active')
        ->latest()
        ->get();

    return Inertia::render('index', [
        'campaigns' => $campaigns,
    ]);
})->name('home');

// Public routes
Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
Route::get('/reports/{report}', [\App\Http\Controllers\ReportController::class, 'show'])->name('reports.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $donations = \App\Models\Donation::with(['campaign'])
            ->where('donor_id', auth()->id())
            ->latest()
            ->get();

        $totalDonated = $donations->where('status', 'paid')->sum('amount');
        $totalDonations = $donations->where('status', 'paid')->count();
        $campaignsHelped = $donations->where('status', 'paid')->pluck('campaign_id')->unique()->count();
        $pendingDonations = $donations->where('status', 'pending')->count();

        return Inertia::render('Dashboard', [
            'donations' => $donations,
            'stats' => [
                'totalDonated' => $totalDonated,
                'totalDonations' => $totalDonations,
                'campaignsHelped' => $campaignsHelped,
                'pendingDonations' => $pendingDonations,
            ],
        ]);
    })->name('dashboard');

    Route::resource('campaigns', \App\Http\Controllers\CampaignController::class);
    Route::resource('donations', \App\Http\Controllers\DonationController::class);

    // Payment routes for donations
    Route::get('/donations/{donation}/payment', [\App\Http\Controllers\PaymentController::class, 'show'])->name('donations.payment');
    Route::post('/donations/{donation}/process-payment', [\App\Http\Controllers\PaymentController::class, 'processPayment'])->name('donations.payment.process');
    Route::get('/donations/{donation}/payment/success', [\App\Http\Controllers\PaymentController::class, 'paymentSuccess'])->name('donations.payment.success');
    Route::get('/donations/{donation}/payment/pending', [\App\Http\Controllers\PaymentController::class, 'paymentPending'])->name('donations.payment.pending');
    Route::get('/donations/{donation}/receipt', [\App\Http\Controllers\PaymentController::class, 'downloadReceipt'])->name('donations.receipt');

    // Reports create, edit, update, destroy require auth
    Route::get('/reports/create', [\App\Http\Controllers\ReportController::class, 'create'])->name('reports.create');
    Route::post('/reports', [\App\Http\Controllers\ReportController::class, 'store'])->name('reports.store');
    Route::get('/reports/{report}/edit', [\App\Http\Controllers\ReportController::class, 'edit'])->name('reports.edit');
    Route::put('/reports/{report}', [\App\Http\Controllers\ReportController::class, 'update'])->name('reports.update');
    Route::patch('/reports/{report}', [\App\Http\Controllers\ReportController::class, 'update']);
    Route::delete('/reports/{report}', [\App\Http\Controllers\ReportController::class, 'destroy'])->name('reports.destroy');

    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::resource('payments', \App\Http\Controllers\PaymentController::class);
});

// Public webhook endpoint for payment gateway callbacks
Route::post('/payments/callback', [\App\Http\Controllers\PaymentController::class, 'handleCallback'])->name('payments.callback');

require __DIR__.'/settings.php';
