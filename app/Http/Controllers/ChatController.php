<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Store a new chat message.
     */
    public function store(Request $request, Booking $booking)
    {
        // Check authorization - only renter or owner can chat
        if (Auth::id() !== $booking->renter_id && Auth::id() !== $booking->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'message' => 'required|string|max:1000',
            'message_type' => 'in:text,price_offer',
            'price_offer' => 'nullable|numeric|min:0'
        ]);

        $receiverId = Auth::id() === $booking->renter_id 
            ? $booking->owner_id 
            : $booking->renter_id;

        Chat::create([
            'booking_id' => $booking->id,
            'sender_id' => Auth::id(),
            'receiver_id' => $receiverId,
            'message' => $request->message,
            'message_type' => $request->message_type ?? 'text',
            'price_offer' => $request->price_offer,
        ]);

        return back();
    }

    /**
     * Mark messages as read.
     */
    public function update(Request $request, Booking $booking)
    {
        // Check authorization - only renter or owner can mark as read
        if (Auth::id() !== $booking->renter_id && Auth::id() !== $booking->owner_id) {
            abort(403, 'Unauthorized action.');
        }

        Chat::where('booking_id', $booking->id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}