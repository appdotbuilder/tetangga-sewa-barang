<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Booking
 *
 * @property int $id
 * @property string $booking_code
 * @property int $item_id
 * @property int $renter_id
 * @property int $owner_id
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon $end_date
 * @property int $duration_days
 * @property string $rate_type
 * @property float $rate_amount
 * @property float|null $deposit_amount
 * @property float $total_amount
 * @property float|null $negotiated_amount
 * @property string $status
 * @property string $payment_status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $pickup_confirmed_at
 * @property \Illuminate\Support\Carbon|null $return_confirmed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Item $item
 * @property-read \App\Models\User $renter
 * @property-read \App\Models\User $owner
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Chat> $chats
 * @property-read int|null $chats_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereBookingCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereRenterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Booking whereStatus($value)
 * @method static \Database\Factories\BookingFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Booking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'booking_code',
        'item_id',
        'renter_id',
        'owner_id',
        'start_date',
        'end_date',
        'duration_days',
        'rate_type',
        'rate_amount',
        'deposit_amount',
        'total_amount',
        'negotiated_amount',
        'status',
        'payment_status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'rate_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'negotiated_amount' => 'decimal:2',
        'pickup_confirmed_at' => 'datetime',
        'return_confirmed_at' => 'datetime',
    ];

    /**
     * Get the item being booked.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the renter of this booking.
     */
    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'renter_id');
    }

    /**
     * Get the owner of the item.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the chats for this booking.
     */
    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class);
    }

    /**
     * Get the reviews for this booking.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Generate a unique booking code.
     */
    public static function generateBookingCode(): string
    {
        do {
            $code = 'BK-' . strtoupper(substr(hash('sha256', uniqid('', true)), 0, 8));
        } while (static::where('booking_code', $code)->exists());

        return $code;
    }
}