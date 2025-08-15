<?php

use App\Enums\TaskStatus;
use App\Models\Provider;
use App\Models\Smtp;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gmail_api_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Smtp::class)->constrained('smtps');
            $table->foreignIdFor(Provider::class)->constrained('providers');
            $table->string('name');
            $table->string('region');
            $table->integer('time');
            $table->integer('smtp_count');
            $table->integer('bot_speed');
            $table->integer('smtp_per_bot');
            $table->integer('bot_count');
            $table->string('vps_template_id');
            $table->string('vps_template_version');
            $table->enum('status', TaskStatus::values());
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gmail_api_tasks');
    }
};
