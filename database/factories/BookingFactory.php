<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Booking>
     */
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+1 month');
        $endDate = $this->faker->dateTimeBetween($startDate, '+1 week');
        $durationDays = max(1, (int) $startDate->diff($endDate)->days);

        return [
            'booking_code' => 'BK-' . strtoupper($this->faker->bothify('########')),
            'item_id' => Item::factory(),
            'renter_id' => User::factory(),
            'owner_id' => User::factory(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duration_days' => $durationDays,
            'rate_type' => $this->faker->randomElement(['daily', 'weekly', 'monthly']),
            'rate_amount' => $this->faker->randomFloat(2, 50, 1000),
            'deposit_amount' => $this->faker->randomFloat(2, 50, 500),
            'total_amount' => $this->faker->randomFloat(2, 100, 1500),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected', 'paid', 'active', 'completed']),
            'payment_status' => 'unpaid',
        ];
    }
}