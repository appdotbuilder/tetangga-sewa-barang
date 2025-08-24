<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the user's items.
     */
    public function index()
    {
        $items = Auth::user()->items()
            ->with(['category'])
            ->latest()
            ->paginate(10);

        return Inertia::render('items/index', [
            'items' => $items
        ]);
    }

    /**
     * Show the form for creating a new item.
     */
    public function create()
    {
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('items/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created item.
     */
    public function store(StoreItemRequest $request)
    {
        $item = Auth::user()->items()->create($request->validated());

        return redirect()->route('items.show', $item)
            ->with('success', 'Item berhasil ditambahkan.');
    }

    /**
     * Display the specified item.
     */
    public function show(Item $item)
    {
        $item->load(['category', 'owner', 'reviews.reviewer']);

        return Inertia::render('items/show', [
            'item' => $item,
            'canEdit' => Auth::check() && Auth::id() === $item->user_id,
        ]);
    }

    /**
     * Show the form for editing the specified item.
     */
    public function edit(Item $item)
    {
        // Check authorization
        if (Auth::id() !== $item->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $categories = Category::where('is_active', true)->get();

        return Inertia::render('items/edit', [
            'item' => $item,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified item.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        // Check authorization
        if (Auth::id() !== $item->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $item->update($request->validated());

        return redirect()->route('items.show', $item)
            ->with('success', 'Item berhasil diperbarui.');
    }

    /**
     * Remove the specified item.
     */
    public function destroy(Item $item)
    {
        // Check authorization
        if (Auth::id() !== $item->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $item->delete();

        return redirect()->route('items.index')
            ->with('success', 'Item berhasil dihapus.');
    }
}