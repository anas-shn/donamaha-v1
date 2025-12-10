<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DonationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Donation::with(['campaign', 'donor']);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('donor_name', 'ilike', "%{$search}%")
                    ->orWhere('donor_email', 'ilike', "%{$search}%")
                    ->orWhere('note', 'ilike', "%{$search}%")
                    ->orWhereHas('donor', function ($subQ) use ($search) {
                        $subQ->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Filter by campaign
        if ($request->has('campaign_id') && $request->campaign_id !== '') {
            $query->where('campaign_id', $request->campaign_id);
        }

        // Filter by anonymous
        if ($request->has('is_anonymous') && $request->is_anonymous !== '') {
            $query->where('is_anonymous', $request->is_anonymous === 'true');
        }

        // Filter by amount range
        if ($request->has('amount_min') && $request->amount_min !== '') {
            $query->where('amount', '>=', $request->amount_min);
        }

        if ($request->has('amount_max') && $request->amount_max !== '') {
            $query->where('amount', '<=', $request->amount_max);
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate
        $donations = $query->paginate(20)->withQueryString();

        // Get campaigns for filter
        $campaigns = Campaign::orderBy('title')->get(['id', 'title']);

        return Inertia::render('admin/donations/Index', [
            'donations' => $donations,
            'campaigns' => $campaigns,
            'filters' => $request->only(['search', 'status', 'campaign_id', 'is_anonymous', 'amount_min', 'amount_max', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $campaigns = Campaign::where('status', 'active')
            ->orderBy('title')
            ->get(['id', 'title']);

        $donors = User::whereIn('role', ['user', 'admin', 'organizer'])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('admin/donations/Create', [
            'campaigns' => $campaigns,
            'donors' => $donors,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'campaign_id' => ['required', 'exists:campaigns,id'],
            'donor_id' => ['nullable', 'exists:users,id'],
            'amount' => ['required', 'numeric', 'min:1000'],
            'status' => ['required', 'string', Rule::in(['pending', 'completed', 'failed', 'cancelled'])],
            'note' => ['nullable', 'string', 'max:255'],
            'donor_name' => ['nullable', 'string', 'max:255'],
            'donor_email' => ['nullable', 'email', 'max:255'],
            'is_anonymous' => ['boolean'],
        ]);

        // If donor_id is provided, clear guest donor info
        if (! empty($validated['donor_id'])) {
            $validated['donor_name'] = null;
            $validated['donor_email'] = null;
        }

        $donation = Donation::create($validated);

        // Update campaign collected amount if donation is completed
        if ($donation->status === 'completed') {
            $campaign = Campaign::find($donation->campaign_id);
            $campaign->increment('collected_amount', $donation->amount);
        }

        return redirect()->route('admin.donations.index')
            ->with('success', 'Donation created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Donation $donation)
    {
        $donation->load(['campaign', 'donor', 'payment']);

        return Inertia::render('admin/donations/Show', [
            'donation' => $donation,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Donation $donation)
    {
        $campaigns = Campaign::orderBy('title')
            ->get(['id', 'title']);

        $donors = User::whereIn('role', ['user', 'admin', 'organizer'])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('admin/donations/Edit', [
            'donation' => $donation->load(['campaign', 'donor']),
            'campaigns' => $campaigns,
            'donors' => $donors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Donation $donation)
    {
        $oldStatus = $donation->status;
        $oldAmount = $donation->amount;

        $validated = $request->validate([
            'campaign_id' => ['required', 'exists:campaigns,id'],
            'donor_id' => ['nullable', 'exists:users,id'],
            'amount' => ['required', 'numeric', 'min:1000'],
            'status' => ['required', 'string', Rule::in(['pending', 'completed', 'failed', 'cancelled'])],
            'note' => ['nullable', 'string', 'max:255'],
            'donor_name' => ['nullable', 'string', 'max:255'],
            'donor_email' => ['nullable', 'email', 'max:255'],
            'is_anonymous' => ['boolean'],
        ]);

        // If donor_id is provided, clear guest donor info
        if (! empty($validated['donor_id'])) {
            $validated['donor_name'] = null;
            $validated['donor_email'] = null;
        }

        $donation->update($validated);

        // Update campaign collected amount if status changed
        $campaign = Campaign::find($donation->campaign_id);

        // If status changed from completed to something else, decrement
        if ($oldStatus === 'completed' && $validated['status'] !== 'completed') {
            $campaign->decrement('collected_amount', $oldAmount);
        }

        // If status changed to completed from something else, increment
        if ($oldStatus !== 'completed' && $validated['status'] === 'completed') {
            $campaign->increment('collected_amount', $validated['amount']);
        }

        // If amount changed while status is completed, adjust
        if ($oldStatus === 'completed' && $validated['status'] === 'completed' && $oldAmount !== $validated['amount']) {
            $campaign->decrement('collected_amount', $oldAmount);
            $campaign->increment('collected_amount', $validated['amount']);
        }

        return redirect()->route('admin.donations.index')
            ->with('success', 'Donation updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Donation $donation)
    {
        // Update campaign collected amount if donation was completed
        if ($donation->status === 'completed') {
            $campaign = Campaign::find($donation->campaign_id);
            $campaign->decrement('collected_amount', $donation->amount);
        }

        $donation->delete();

        return redirect()->route('admin.donations.index')
            ->with('success', 'Donation deleted successfully.');
    }

    /**
     * Update donation status.
     */
    public function updateStatus(Request $request, Donation $donation)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'completed', 'failed', 'cancelled'])],
        ]);

        $oldStatus = $donation->status;
        $donation->update(['status' => $validated['status']]);

        // Update campaign collected amount
        $campaign = Campaign::find($donation->campaign_id);

        if ($oldStatus === 'completed' && $validated['status'] !== 'completed') {
            $campaign->decrement('collected_amount', $donation->amount);
        }

        if ($oldStatus !== 'completed' && $validated['status'] === 'completed') {
            $campaign->increment('collected_amount', $donation->amount);
        }

        return back()->with('success', 'Donation status updated successfully.');
    }
}
