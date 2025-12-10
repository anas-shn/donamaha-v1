<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

beforeEach(function () {
    $this->admin = User::factory()->create([
        'role' => 'admin',
        'email' => 'admin@test.com',
    ]);

    $this->user = User::factory()->create([
        'role' => 'user',
        'email' => 'user@test.com',
    ]);
});

it('allows admin to access filament admin panel', function () {
    actingAs($this->admin);

    get('/admin')
        ->assertSuccessful();
});

it('prevents non-admin users from accessing filament admin panel', function () {
    actingAs($this->user);

    get('/admin')
        ->assertForbidden();
});

it('redirects unauthenticated users to login', function () {
    get('/admin')
        ->assertRedirect('/admin/login');
});

it('admin can access users resource in filament', function () {
    actingAs($this->admin);

    get('/admin/users')
        ->assertSuccessful();
});

it('admin can access campaigns resource in filament', function () {
    actingAs($this->admin);

    get('/admin/campaigns')
        ->assertSuccessful();
});

it('admin can access payments resource in filament', function () {
    actingAs($this->admin);

    get('/admin/payments')
        ->assertSuccessful();
});

it('admin can access donations resource in filament', function () {
    actingAs($this->admin);

    get('/admin/donations')
        ->assertSuccessful();
});

it('shows filament dashboard for admin', function () {
    actingAs($this->admin);

    get('/admin')
        ->assertSuccessful()
        ->assertSee('Dashboard');
});

it('admin can access user create page in filament', function () {
    actingAs($this->admin);

    get('/admin/users/create')
        ->assertSuccessful();
});

it('admin can access campaign create page in filament', function () {
    actingAs($this->admin);

    get('/admin/campaigns/create')
        ->assertSuccessful();
});

it('admin can access donation create page in filament', function () {
    actingAs($this->admin);

    get('/admin/donations/create')
        ->assertSuccessful();
});

it('admin can access payment create page in filament', function () {
    actingAs($this->admin);

    get('/admin/payments/create')
        ->assertSuccessful();
});

it('non-admin cannot access user create page in filament', function () {
    actingAs($this->user);

    get('/admin/users/create')
        ->assertForbidden();
});

it('non-admin cannot access campaign create page in filament', function () {
    actingAs($this->user);

    get('/admin/campaigns/create')
        ->assertForbidden();
});

it('admin can see all navigation groups in filament', function () {
    actingAs($this->admin);

    get('/admin')
        ->assertSuccessful()
        ->assertSee('User Management')
        ->assertSee('Campaign Management')
        ->assertSee('Financial');
});
