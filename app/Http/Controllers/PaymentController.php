<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with(['donation.campaign', 'donation.donor'])
            ->latest()
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    /**
     * Show the payment page for a donation.
     */
    public function show(Donation $donation)
    {
        // Authorization: only donor can access payment page
        if ($donation->donor_id !== auth()->id()) {
            abort(403, 'Unauthorized access to payment page.');
        }

        // Check if donation is already paid
        if ($donation->status === 'paid') {
            return redirect()->route('donations.payment.success', $donation->id)
                ->with('info', 'Donation already paid.');
        }

        $donation->load(['campaign.organizer']);

        return Inertia::render('Donations/Payment', [
            'donation' => $donation,
        ]);
    }

    /**
     * Process payment for a donation.
     */
    public function processPayment(Request $request, Donation $donation)
    {
        // Authorization
        if ($donation->donor_id !== auth()->id()) {
            abort(403, 'Unauthorized to process this payment.');
        }

        // Validate donation status
        if ($donation->status === 'paid') {
            return redirect()->route('donations.payment.success', $donation->id)
                ->with('info', 'Donation already paid.');
        }

        $validated = $request->validate([
            'payment_method' => 'required|string|in:qris,bank_transfer,ewallet_gopay,ewallet_ovo,ewallet_dana,credit_card',
        ]);

        DB::beginTransaction();
        try {
            // Create payment record
            $payment = Payment::create([
                'donation_id' => $donation->id,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'paid_at' => null,
            ]);

            // Here you would integrate with payment gateway (Midtrans, Xendit, etc.)
            // For now, we'll simulate the payment flow
            $paymentGatewayResponse = $this->initiatePaymentGateway($donation, $validated['payment_method']);

            // If payment gateway returns immediate success (for demo purposes)
            if ($paymentGatewayResponse['status'] === 'success') {
                $payment->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                $donation->update(['status' => 'paid']);

                // Update campaign collected amount
                $donation->campaign->increment('collected_amount', $donation->amount);

                DB::commit();

                return redirect()->route('donations.payment.success', $donation->id)
                    ->with('success', 'Payment successful!');
            }

            // If payment requires redirect (e.g., to payment gateway)
            if (isset($paymentGatewayResponse['redirect_url'])) {
                DB::commit();
                return Inertia::location($paymentGatewayResponse['redirect_url']);
            }

            DB::commit();

            // Default: redirect to waiting page or instructions
            return redirect()->route('donations.payment.pending', $donation->id);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment processing error: ' . $e->getMessage());

            return back()->with('error', 'Payment processing failed. Please try again.');
        }
    }

    /**
     * Show payment success page.
     */
    public function paymentSuccess(Donation $donation)
    {
        // Authorization
        if ($donation->donor_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        $donation->load(['campaign.organizer', 'payment']);

        return Inertia::render('Donations/PaymentSuccess', [
            'donation' => $donation,
        ]);
    }

    /**
     * Show payment pending/waiting page.
     */
    public function paymentPending(Donation $donation)
    {
        // Authorization
        if ($donation->donor_id !== auth()->id()) {
            abort(403);
        }

        $donation->load(['campaign.organizer', 'payment']);

        return Inertia::render('Donations/PaymentPending', [
            'donation' => $donation,
        ]);
    }

    /**
     * Handle payment callback/webhook from payment gateway.
     */
    public function handleCallback(Request $request)
    {
        // Validate the callback is from legitimate payment gateway
        // This is a placeholder - implement proper signature verification

        try {
            $paymentId = $request->input('payment_id');
            $status = $request->input('status');
            $transactionId = $request->input('transaction_id');

            $payment = Payment::findOrFail($paymentId);
            $donation = $payment->donation;

            DB::beginTransaction();

            if ($status === 'success' || $status === 'paid') {
                $payment->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                $donation->update(['status' => 'paid']);

                // Update campaign collected amount
                $donation->campaign->increment('collected_amount', $donation->amount);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment confirmed',
                ]);
            }

            if ($status === 'failed' || $status === 'cancelled') {
                $payment->update([
                    'payment_status' => 'failed',
                ]);

                $donation->update(['status' => 'cancelled']);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment cancelled',
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Callback received',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment callback error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Callback processing failed',
            ], 500);
        }
    }

    /**
     * Download payment receipt.
     */
    public function downloadReceipt(Donation $donation)
    {
        // Authorization
        if ($donation->donor_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        if ($donation->status !== 'paid') {
            return back()->with('error', 'Receipt only available for paid donations.');
        }

        // TODO: Implement PDF generation using package like dompdf or snappy
        // For now, return a simple response
        return response()->download(
            public_path('receipts/sample-receipt.pdf'),
            'receipt-' . $donation->id . '.pdf'
        );
    }

    /**
     * Simulate payment gateway integration.
     * In production, replace this with actual payment gateway API calls.
     */
    private function initiatePaymentGateway(Donation $donation, string $paymentMethod): array
    {
        // This is a simulation - in production, integrate with:
        // - Midtrans (https://midtrans.com)
        // - Xendit (https://xendit.co)
        // - Doku, etc.

        // For demo purposes, we'll return immediate success
        // In production, this would return a redirect URL to the payment gateway

        return [
            'status' => 'success',
            'transaction_id' => 'TXN-' . time() . '-' . $donation->id,
            'message' => 'Payment processed successfully',
        ];

        // Example of redirect flow:
        // return [
        //     'status' => 'redirect',
        //     'redirect_url' => 'https://payment-gateway.com/checkout/...',
        //     'transaction_id' => 'TXN-...',
        // ];
    }

    /**
     * Store a newly created resource in storage (API).
     */
    public function store(Request $request)
    {
        $request->validate([
            'donation_id' => 'required|exists:donations,id',
            'payment_method' => 'required|string|max:100',
            'payment_status' => 'required|string|max:50',
            'paid_at' => 'nullable|date',
        ]);

        $payment = Payment::create($request->all());

        return response()->json($payment, 201);
    }

    /**
     * Update the specified resource in storage (API).
     */
    public function update(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        $request->validate([
            'donation_id' => 'sometimes|required|exists:donations,id',
            'payment_method' => 'sometimes|required|string|max:100',
            'payment_status' => 'sometimes|required|string|max:50',
            'paid_at' => 'nullable|date',
        ]);

        $payment->update($request->all());

        return response()->json($payment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted']);
    }
}
