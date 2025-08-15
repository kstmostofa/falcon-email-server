<?php

use App\Models\Vps;
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
        Schema::table('smtp_data', function (Blueprint $table) {
            $table->string( 'vps_ip_address')->nullable();
            $table->index('vps_ip_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('smtp_data', function (Blueprint $table) {
            $table->dropIndex(['vps_ip_address']);
            $table->dropColumn('vps_ip_address');
        });
    }
};
