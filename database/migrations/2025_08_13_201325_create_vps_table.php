<?php

use App\Enums\BotType;
use App\Models\GmailApiTask;
use App\Models\Provider;
use App\Models\Task;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vps', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Task::class)->nullable()->constrained('tasks');
            $table->foreignIdFor(GmailApiTask::class)->nullable()->constrained('gmail_api_tasks');
            $table->foreignIdFor(Provider::class)->constrained('providers');
            $table->string('instance_id');
            $table->string('region');
            $table->string('ip_address')->nullable();
            $table->string('status')->nullable();
            $table->timestamp('last_heartbeat')->nullable();
            $table->enum('bot_type', BotType::values());
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vps');
    }
};
