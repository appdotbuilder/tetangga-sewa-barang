<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique()->comment('Unique transaction code');
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('renter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('duration_days');
            $table->enum('rate_type', ['daily', 'weekly', 'monthly']);
            $table->decimal('rate_amount', 10, 2);
            $table->decimal('deposit_amount', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('negotiated_amount', 10, 2)->nullable()->comment('Final amount after negotiation');
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid', 'active', 'returned', 'completed', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('unpaid');
            $table->text('notes')->nullable();
            $table->timestamp('pickup_confirmed_at')->nullable();
            $table->timestamp('return_confirmed_at')->nullable();
            $table->timestamps();
            
            $table->index('booking_code');
            $table->index('item_id');
            $table->index('renter_id');
            $table->index('owner_id');
            $table->index('status');
            $table->index('start_date');
            $table->index(['status', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};