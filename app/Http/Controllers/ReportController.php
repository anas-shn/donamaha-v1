<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
            'campaign_id' => $campaign_id
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
            // Check if user is organizer
            if ($campaign && $campaign->organizer_id !== auth()->id()) {
                abort(403);
            }
        }

        return Inertia::render('Reports/Create', [
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
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'total_spent' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $campaign = Campaign::findOrFail($validated['campaign_id']);
        if ($campaign->organizer_id !== auth()->id()) {
            abort(403);
        }

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('reports', 'public');
        }

        Report::create([
            'campaign_id' => $validated['campaign_id'],
            'author_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'total_spent' => $validated['total_spent'],
            'image_path' => $path,
        ]);

        return redirect()->route('campaigns.show', $campaign->id)->with('success', 'Report created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        $report->load(['campaign', 'author']);
        return Inertia::render('Reports/Show', [
            'report' => $report
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
            'report' => $report
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
