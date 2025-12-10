<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Campaign::with('organizer');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('full_description', 'ilike', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Filter by organizer
        if ($request->has('organizer_id') && $request->organizer_id !== '') {
            $query->where('organizer_id', $request->organizer_id);
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate
        $campaigns = $query->paginate(15)->withQueryString();

        // Get organizers for filter
        $organizers = User::whereIn('role', ['admin', 'organizer'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/campaigns/Index', [
            'campaigns' => $campaigns,
            'organizers' => $organizers,
            'filters' => $request->only(['search', 'status', 'organizer_id', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $organizers = User::whereIn('role', ['admin', 'organizer'])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('admin/campaigns/Create', [
            'organizers' => $organizers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'organizer_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'full_description' => ['required', 'string'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', Rule::in(['draft', 'active', 'completed', 'cancelled'])],
            'image' => ['nullable', 'image', 'max:5120'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('campaigns', 'public');
        }

        $campaign = Campaign::create([
            'organizer_id' => $validated['organizer_id'],
            'title' => $validated['title'],
            'full_description' => $validated['full_description'],
            'target_amount' => $validated['target_amount'],
            'collected_amount' => 0,
            'status' => $validated['status'],
            'image_path' => $imagePath,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaign created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign)
    {
        $campaign->load(['organizer', 'donations.donor', 'reports']);

        $stats = [
            'total_donations' => $campaign->donations()->where('status', 'completed')->sum('amount'),
            'donations_count' => $campaign->donations()->where('status', 'completed')->count(),
            'pending_donations' => $campaign->donations()->where('status', 'pending')->count(),
            'unique_donors' => $campaign->donations()
                ->where('status', 'completed')
                ->distinct('donor_id')
                ->count('donor_id'),
            'progress_percentage' => $campaign->target_amount > 0
                ? round(($campaign->collected_amount / $campaign->target_amount) * 100, 2)
                : 0,
        ];

        return Inertia::render('admin/campaigns/Show', [
            'campaign' => $campaign,
            'stats' => $stats,
            'recent_donations' => $campaign->donations()
                ->with('donor')
                ->latest()
                ->take(10)
                ->get(),
            'reports' => $campaign->reports()->latest()->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Campaign $campaign)
    {
        $organizers = User::whereIn('role', ['admin', 'organizer'])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('admin/campaigns/Edit', [
            'campaign' => $campaign,
            'organizers' => $organizers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'organizer_id' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'full_description' => ['required', 'string'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', Rule::in(['draft', 'active', 'completed', 'cancelled'])],
            'image' => ['nullable', 'image', 'max:5120'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($campaign->image_path) {
                Storage::disk('public')->delete($campaign->image_path);
            }

            $validated['image_path'] = $request->file('image')->store('campaigns', 'public');
        }

        $campaign->update([
            'organizer_id' => $validated['organizer_id'],
            'title' => $validated['title'],
            'full_description' => $validated['full_description'],
            'target_amount' => $validated['target_amount'],
            'status' => $validated['status'],
            'image_path' => $validated['image_path'] ?? $campaign->image_path,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaign updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign)
    {
        // Delete image if exists
        if ($campaign->image_path) {
            Storage::disk('public')->delete($campaign->image_path);
        }

        $campaign->delete();

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaign deleted successfully.');
    }
}
