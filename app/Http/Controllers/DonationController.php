<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // If user is admin, show all. If regular user, show theirs.
        // For now, assuming user sees their own donations.
        $donations = Donation::with(['campaign', 'payment'])
            ->where('donor_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Donations/Index', [
            'donations' => $donations
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $campaign_id = $request->query('campaign_id');
        $campaign = null;
        if ($campaign_id) {
            $campaign = Campaign::find($campaign_id);
        }

        return Inertia::render('Donations/Create', [
            'campaign' => $campaign
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:1000', // Minimum donation amount
            'note' => 'nullable|string|max:255',
        ]);

        $donation = Donation::create([
            'donor_id' => auth()->id(),
            'campaign_id' => $validated['campaign_id'],
            'amount' => $validated['amount'],
            'note' => $validated['note'],
            'status' => 'pending',
        ]);

        // Redirect to payment selection or confirmation
        return redirect()->route('donations.show', $donation->id)->with('success', 'Donation initiated. Please complete payment.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Donation $donation)
    {
        // Authorization: only donor or admin
        if ($donation->donor_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        $donation->load(['campaign', 'payment']);
        return Inertia::render('Donations/Show', [
            'donation' => $donation
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Donation $donation)
    {
        // Typically donations aren't edited by users once made, maybe admin only?
        // Leaving empty or restricted for now.
        abort(404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Donation $donation)
    {
        // Admin or system update for status
        if (auth()->user()->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,paid,cancelled',
        ]);

        $donation->update(['status' => $validated['status']]);
        
        // Update collected amount if paid
        if ($validated['status'] === 'paid') {
             $donation->campaign->increment('collected_amount', $donation->amount);
        }

        return back()->with('success', 'Donation status updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Donation $donation)
    {
        if ($donation->donor_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        if ($donation->status === 'paid') {
            return back()->with('error', 'Cannot delete paid donation.');
        }

        $donation->delete();

        return redirect()->route('donations.index')->with('success', 'Donation cancelled.');
    }
}
