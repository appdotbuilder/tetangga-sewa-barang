<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Item;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display user's bookings.
     */
    public function index()
    {
        $rentals = Auth::user()->rentals()
            ->with(['item', 'owner'])
            ->latest()
            ->paginate(10);

        $bookings = Auth::user()->bookings()
            ->with(['item', 'renter'])
            ->latest()
            ->paginate(10);

        return Inertia::render('bookings/index', [
            'rentals' => $rentals,
            'bookings' => $bookings
        ]);
    }

    /**
     * Show booking form for an item.
     */
    public function create(Item $item)
    {
        if ($item->status !== 'available') {
            return redirect()->route('items.show', $item)
                ->with('error', 'Item tidak tersedia untuk disewa.');
        }

        return Inertia::render('bookings/create', [
            'item' => $item->load(['category', 'owner'])
        ]);
    }

    /**
     * Store a new booking request.
     */
    public function store(StoreBookingRequest $request)
    {
        $item = Item::findOrFail($request->item_id);

        if ($item->status !== 'available') {
            return back()->with('error', 'Item tidak tersedia untuk disewa.');
        }

        if ($item->user_id === Auth::id()) {
            return back()->with('error', 'Anda tidak dapat menyewa item sendiri.');
        }

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $durationDays = $startDate->diffInDays($endDate) + 1;

        // Calculate total amount
        $rate = match($request->rate_type) {
            'daily' => $item->daily_rate,
            'weekly' => $item->weekly_rate,
            'monthly' => $item->monthly_rate,
            default => $item->daily_rate
        };

        $totalAmount = $rate + ($item->deposit ?? 0);

        $booking = Booking::create([
            'booking_code' => Booking::generateBookingCode(),
            'item_id' => $item->id,
            'renter_id' => Auth::id(),
            'owner_id' => $item->user_id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duration_days' => $durationDays,
            'rate_type' => $request->rate_type,
            'rate_amount' => $rate,
            'deposit_amount' => $item->deposit,
            'total_amount' => $totalAmount,
            'notes' => $request->notes,
        ]);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Pengajuan sewa berhasil dikirim.');
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        // Check authorization - only renter or owner can view
        if (Auth::id() !== $booking->renter_id && Auth::id() !== $booking->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->load(['item.category', 'renter', 'owner', 'chats.sender']);

        return Inertia::render('bookings/show', [
            'booking' => $booking
        ]);
    }

    /**
     * Update booking status (approve/reject).
     */
    public function update(Request $request, Booking $booking)
    {
        // Check authorization - only owner can approve/reject
        if (Auth::id() !== $booking->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'negotiated_amount' => 'nullable|numeric|min:0'
        ]);

        $updateData = ['status' => $request->status];

        if ($request->filled('negotiated_amount')) {
            $updateData['negotiated_amount'] = $request->negotiated_amount;
        }

        $booking->update($updateData);

        $message = $request->status === 'approved' 
            ? 'Pengajuan sewa disetujui.' 
            : 'Pengajuan sewa ditolak.';

        return back()->with('success', $message);
    }
}