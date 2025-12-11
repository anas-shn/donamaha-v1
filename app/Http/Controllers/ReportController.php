<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Models\Campaign;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $campaign_id = $request->query('campaign_id');

        $query = Report::with(['campaign', 'author']);

        if ($campaign_id) {
            $query->where('campaign_id', $campaign_id);
        }

        $reports = $query->latest()->get();

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'campaign_id' => $campaign_id,
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
            $campaign = Campaign::with('organizer')->find($campaign_id);
            // Check if user is organizer or admin
            if ($campaign && $campaign->organizer_id !== auth()->id() && auth()->user()->role !== 'admin') {
                abort(403, 'Anda tidak memiliki akses untuk membuat laporan untuk kampanye ini.');
            }
        }

        // Get user's campaigns with organizer relationship
        if (auth()->user()->role === 'admin') {
            // Admins can see all campaigns
            $campaigns = Campaign::select('id', 'title', 'organizer_id', 'collected_amount', 'target_amount')
                ->get();
        } else {
            // Organizers can only see their own campaigns
            $campaigns = Campaign::select('id', 'title', 'organizer_id', 'collected_amount', 'target_amount')
                ->where('organizer_id', auth()->id())
                ->get();
        }

        return Inertia::render('Reports/Create', [
            'campaign' => $campaign ? [
                'id' => $campaign->id,
                'title' => $campaign->title,
                'organizer_id' => $campaign->organizer_id,
                'collected_amount' => $campaign->collected_amount,
                'target_amount' => $campaign->target_amount,
            ] : null,
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reports', 'public');
        }

        $report = Report::create([
            'campaign_id' => $validated['campaign_id'],
            'author_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'total_spent' => $validated['total_spent'],
            'image_path' => $imagePath,
        ]);

        return redirect()
            ->route('reports.show', $report->id)
            ->with('success', 'Laporan berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        $report->load(['campaign', 'author']);

        return Inertia::render('Reports/Show', [
            'report' => $report,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Report $report)
    {
        if ($report->author_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Reports/Edit', [
            'report' => $report,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Report $report)
    {
        if ($report->author_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'total_spent' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($report->image_path) {
                Storage::disk('public')->delete($report->image_path);
            }
            $report->image_path = $request->file('image')->store('reports', 'public');
        }

        $report->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'total_spent' => $validated['total_spent'],
        ]);

        return redirect()->route('reports.show', $report->id)->with('success', 'Report updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        if ($report->author_id !== auth()->id()) {
            abort(403);
        }

        if ($report->image_path) {
            Storage::disk('public')->delete($report->image_path);
        }

        $report->delete();

        return redirect()->route('campaigns.show', $report->campaign_id)->with('success', 'Report deleted successfully.');
    }
}
