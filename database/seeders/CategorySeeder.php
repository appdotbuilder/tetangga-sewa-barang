<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Elektronik',
                'icon' => '📱',
                'description' => 'Perangkat elektronik seperti laptop, kamera, dll',
                'is_active' => true,
            ],
            [
                'name' => 'Peralatan Rumah',
                'icon' => '🏠',
                'description' => 'Alat-alat rumah tangga dan furniture',
                'is_active' => true,
            ],
            [
                'name' => 'Olahraga',
                'icon' => '⚽',
                'description' => 'Peralatan olahraga dan outdoor',
                'is_active' => true,
            ],
            [
                'name' => 'Kendaraan',
                'icon' => '🚗',
                'description' => 'Sepeda, motor, mobil, dll',
                'is_active' => true,
            ],
            [
                'name' => 'Pesta & Acara',
                'icon' => '🎉',
                'description' => 'Dekorasi, sound system, tenda, dll',
                'is_active' => true,
            ],
            [
                'name' => 'Alat Kerja',
                'icon' => '🔨',
                'description' => 'Peralatan konstruksi dan pertukangan',
                'is_active' => true,
            ],
            [
                'name' => 'Fashion',
                'icon' => '👗',
                'description' => 'Pakaian, aksesoris, tas, dll',
                'is_active' => true,
            ],
            [
                'name' => 'Hobi',
                'icon' => '🎨',
                'description' => 'Alat musik, art supplies, game, dll',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}