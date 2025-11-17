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
 Schema::create('shipments', function (Blueprint $table) {
    $table->id();
    $table->string('tracking_number')->unique();
    $table->unsignedBigInteger('company_id');
    $table->unsignedBigInteger('transport_id');
    $table->string('origin_address');
    $table->string('destination_address');
    $table->dateTime('pickup_date');
    $table->dateTime('estimated_delivery');
    $table->dateTime('actual_delivery')->nullable();
    $table->string('status');
    $table->decimal('total_weight', 10, 2);
    $table->string('priority');
    $table->text('notes')->nullable();
    $table->timestamps();
    $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
    $table->foreign('transport_id')->references('id')->on('transports')->onDelete('cascade');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
