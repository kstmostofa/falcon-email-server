<?php

use App\Enums\BotType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('smtps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('bot_type', BotType::values());
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('smtps');
    }
};
