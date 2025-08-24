<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page with search and browse functionality
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public item routes
Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Item management routes
    Route::resource('items', ItemController::class)->except(['show']);
    
    // Booking routes
    Route::resource('bookings', BookingController::class)->except(['edit', 'destroy']);
    Route::get('/items/{item}/book', [BookingController::class, 'create'])->name('bookings.create');
    
    // Chat routes
    Route::post('/bookings/{booking}/chat', [ChatController::class, 'store'])->name('chat.store');
    Route::patch('/bookings/{booking}/chat/read', [ChatController::class, 'update'])->name('chat.read');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
