<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Item>
     */
    protected $model = Item::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'photos' => null,
            'daily_rate' => $this->faker->randomFloat(2, 10, 200),
            'weekly_rate' => $this->faker->randomFloat(2, 50, 1000),
            'monthly_rate' => $this->faker->randomFloat(2, 200, 4000),
            'deposit' => $this->faker->randomFloat(2, 50, 500),
            'status' => 'available',
            'pickup_address' => $this->faker->address(),
            'latitude' => $this->faker->latitude(-6.9, -6.1),
            'longitude' => $this->faker->longitude(106.8, 107.0),
            'max_radius_km' => $this->faker->numberBetween(1, 10),
            'average_rating' => $this->faker->randomFloat(1, 3.0, 5.0),
            'total_reviews' => $this->faker->numberBetween(0, 50),
        ];
    }
}