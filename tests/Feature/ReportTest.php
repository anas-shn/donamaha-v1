<?php

use App\Models\Campaign;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\post;

beforeEach(function () {
    Storage::fake('public');
});

it('allows organizer to create report for their campaign', function () {
    if (! function_exists('imagecreatetruecolor')) {
        $this->markTestSkipped('GD extension is not installed.');
    }

    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Penggunaan Dana Januari 2024',
            'content' => str_repeat('Ini adalah konten laporan yang cukup panjang untuk memenuhi validasi minimal 100 karakter. ', 2),
            'total_spent' => 5000000,
            'image' => UploadedFile::fake()->image('report.jpg', 800, 600),
        ]);

    $response->assertRedirect();

    assertDatabaseHas('reports', [
        'campaign_id' => $campaign->id,
        'author_id' => $organizer->id,
        'title' => 'Laporan Penggunaan Dana Januari 2024',
        'total_spent' => 5000000,
    ]);

    Storage::disk('public')->assertExists(Report::first()->image_path);
});

it('allows admin to create report for any campaign', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($admin)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Admin',
            'content' => str_repeat('Konten laporan dari admin yang memenuhi minimal 100 karakter untuk validasi. ', 2),
            'total_spent' => 3000000,
        ]);

    $response->assertRedirect();

    assertDatabaseHas('reports', [
        'campaign_id' => $campaign->id,
        'author_id' => $admin->id,
        'title' => 'Laporan Admin',
    ]);
});

it('prevents organizer from creating report for other organizer campaign', function () {
    $organizer1 = User::factory()->create(['role' => 'organizer']);
    $organizer2 = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer2->id]);

    $response = actingAs($organizer1)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Tidak Sah',
            'content' => str_repeat('Konten laporan yang seharusnya tidak bisa dibuat. ', 5),
            'total_spent' => 1000000,
        ]);

    $response->assertForbidden();
});

it('prevents regular user from creating report', function () {
    $user = User::factory()->create(['role' => 'user']);
    $campaign = Campaign::factory()->create();

    $response = actingAs($user)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan User',
            'content' => str_repeat('User biasa tidak boleh buat laporan. ', 5),
            'total_spent' => 500000,
        ]);

    $response->assertForbidden();
});

it('requires authentication to create report', function () {
    $campaign = Campaign::factory()->create();

    $response = post(route('reports.store'), [
        'campaign_id' => $campaign->id,
        'title' => 'Laporan',
        'content' => str_repeat('Konten laporan tanpa autentikasi. ', 5),
        'total_spent' => 500000,
    ]);

    $response->assertRedirect(route('login'));
});

it('validates required fields', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), []);

    $response->assertSessionHasErrors(['campaign_id', 'title', 'content', 'total_spent']);
});

it('validates content minimum length', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Singkat',
            'content' => 'Terlalu pendek',
            'total_spent' => 1000000,
        ]);

    $response->assertSessionHasErrors(['content']);
});

it('validates image file type', function () {
    if (! function_exists('imagecreatetruecolor')) {
        $this->markTestSkipped('GD extension is not installed.');
    }

    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan dengan File Salah',
            'content' => str_repeat('Konten laporan dengan file yang bukan gambar. ', 5),
            'total_spent' => 2000000,
            'image' => UploadedFile::fake()->create('document.pdf', 100),
        ]);

    $response->assertSessionHasErrors(['image']);
});

it('validates image file size', function () {
    if (! function_exists('imagecreatetruecolor')) {
        $this->markTestSkipped('GD extension is not installed.');
    }

    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan dengan Gambar Besar',
            'content' => str_repeat('Konten laporan dengan gambar yang terlalu besar. ', 5),
            'total_spent' => 2000000,
            'image' => UploadedFile::fake()->image('huge.jpg')->size(3000),
        ]);

    $response->assertSessionHasErrors(['image']);
});

it('validates total spent is numeric and not negative', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Negatif',
            'content' => str_repeat('Konten laporan dengan total spent negatif. ', 5),
            'total_spent' => -1000,
        ]);

    $response->assertSessionHasErrors(['total_spent']);
});

it('can create report without image', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Tanpa Gambar',
            'content' => str_repeat('Konten laporan tanpa gambar dokumentasi adalah valid. ', 5),
            'total_spent' => 1500000,
        ]);

    $response->assertRedirect();

    assertDatabaseHas('reports', [
        'campaign_id' => $campaign->id,
        'title' => 'Laporan Tanpa Gambar',
        'image_path' => null,
    ]);
});

it('redirects to report show page after successful creation', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->post(route('reports.store'), [
            'campaign_id' => $campaign->id,
            'title' => 'Laporan Redirect Test',
            'content' => str_repeat('Testing redirect setelah berhasil membuat laporan. ', 5),
            'total_spent' => 2500000,
        ]);

    $report = Report::first();
    $response->assertRedirect(route('reports.show', $report->id));
});

it('shows create form to organizer', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->get(route('reports.create'));

    $response->assertSuccessful();
});

it('shows create form with campaign preselected when campaign_id provided', function () {
    $organizer = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer->id]);

    $response = actingAs($organizer)
        ->get(route('reports.create', ['campaign_id' => $campaign->id]));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Reports/Create')
        ->has('campaign')
        ->where('campaign.id', $campaign->id)
    );
});

it('prevents organizer from accessing create form for other organizer campaign', function () {
    $organizer1 = User::factory()->create(['role' => 'organizer']);
    $organizer2 = User::factory()->create(['role' => 'organizer']);
    $campaign = Campaign::factory()->create(['organizer_id' => $organizer2->id]);

    $response = actingAs($organizer1)
        ->get(route('reports.create', ['campaign_id' => $campaign->id]));

    $response->assertForbidden();
});
