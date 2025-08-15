<?php

use App\Models\Smtp;
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
        Schema::create('smtp_data', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Smtp::class)->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->string('password');
            $table->string('recovery_email')->nullable();
            $table->text('oauth_json')->nullable();
            $table->string('access_token')->nullable();
            $table->string('refresh_token')->nullable();
            $table->string('smtp_host')->nullable();
            $table->string('smtp_port')->nullable();
            $table->string('smtp_domain_name')->nullable();
            $table->timestamp('last_refresh_time')->nullable();
            $table->boolean('status')->default(false);
            $table->integer('count')->default(0);
            $table->index(['email', 'smtp_host', 'smtp_port', 'smtp_domain_name']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('smtp_data');
    }
};
