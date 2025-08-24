<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page with search functionality.
     */
    public function index(Request $request)
    {
        $query = Item::with(['category', 'owner'])
            ->available()
            ->latest();

        // Search by keyword
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by location (simplified - in real app would use geolocation)
        if ($request->filled('location')) {
            $query->where('pickup_address', 'like', '%' . $request->location . '%');
        }

        $items = $query->paginate(12);
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('welcome', [
            'items' => $items,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'location']),
        ]);
    }
}