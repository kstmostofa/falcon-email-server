<?php

use App\Enums\BotType;
use App\Enums\TaskStatus;
use App\Enums\Tencent;
use App\Models\Attachment;
use App\Models\Contact;
use App\Models\SenderName;
use App\Models\Smtp;
use App\Models\Subject;
use App\Models\Template;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(Contact::class)->constrained('contacts');
            $table->foreignIdFor(SenderName::class)->constrained('sender_names');
            $table->foreignIdFor(Subject::class)->constrained('subjects');
            $table->foreignIdFor(Template::class)->constrained('templates');
            $table->foreignIdFor(Attachment::class)->constrained('attachments');
            $table->foreignIdFor(Smtp::class)->constrained('smtps');
            $table->enum('bot_type', BotType::values());
            $table->string('region');
            $table->integer('thread_count')->default(1);
            $table->integer('bot_count')->default(0);
            $table->integer('time')->default(0);
            $table->enum('status', TaskStatus::values());
            $table->integer('smtp_count')->default(0);
            $table->integer('smtp_limit')->default(0);
            $table->integer('smtp_per_bot')->default(1);
            $table->integer('thread_capacity')->default(1);
            $table->integer('contact_count')->default(0);
            $table->integer('contact_per_bot')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
