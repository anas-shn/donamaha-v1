<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('campaigns', \App\Http\Controllers\CampaignController::class);
    Route::resource('donations', \App\Http\Controllers\DonationController::class);
    Route::resource('reports', \App\Http\Controllers\ReportController::class);
    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::resource('payments', \App\Http\Controllers\PaymentController::class);
});

require __DIR__.'/settings.php';
