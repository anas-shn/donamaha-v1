<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCampaignRequest;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $campaigns = Campaign::with('organizer')->latest()->get();

        return Inertia::render('campaigns/index', [
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check if user is organizer or admin
        if (! auth()->check() || ! in_array(auth()->user()->role, ['organizer', 'admin'])) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('campaigns/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCampaignRequest $request)
    {
        $validated = $request->validated();

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('campaigns', 'public');
        }

        $campaign = Campaign::create([
            'organizer_id' => auth()->id(),
            'title' => $validated['title'],
            'full_description' => $validated['full_description'],
            'target_amount' => $validated['target_amount'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'image_path' => $path,
            'status' => 'active',
            'collected_amount' => 0,
        ]);

        return redirect()->route('campaigns.show', $campaign->id)
            ->with('success', 'Kampanye berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign)
    {
        $campaign->load(['organizer', 'donations.donor', 'reports']);

        return Inertia::render('campaigns/show', [
            'campaign' => $campaign,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Campaign $campaign)
    {
        // Check if user is the organizer or admin
        if (auth()->id() !== $campaign->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('campaigns/Edit', [
            'campaign' => $campaign,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Campaign $campaign)
    {
        // Check if user is the organizer or admin
        if (auth()->id() !== $campaign->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'full_description' => 'required|string',
            'target_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'image' => 'nullable|image|max:2048',
            'status' => 'required|string|in:active,completed,cancelled',
        ]);

        if ($request->hasFile('image')) {
            if ($campaign->image_path) {
                Storage::disk('public')->delete($campaign->image_path);
            }
            $campaign->image_path = $request->file('image')->store('campaigns', 'public');
        }

        $campaign->update([
            'title' => $validated['title'],
            'full_description' => $validated['full_description'],
            'target_amount' => $validated['target_amount'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('campaigns.show', $campaign->id)
            ->with('success', 'Kampanye berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign)
    {
        // Check if user is the organizer or admin
        if (auth()->id() !== $campaign->organizer_id && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        if ($campaign->image_path) {
            Storage::disk('public')->delete($campaign->image_path);
        }

        $campaign->delete();

        return redirect()->route('campaigns.index')
            ->with('success', 'Kampanye berhasil dihapus!');
    }
}
