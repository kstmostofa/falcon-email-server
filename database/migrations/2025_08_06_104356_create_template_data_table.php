<?php

use App\Enums\TemplateType;
use App\Models\Template;
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
        Schema::create('template_data', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Template::class)->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->enum('content_type', TemplateType::values());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_data');
    }
};
