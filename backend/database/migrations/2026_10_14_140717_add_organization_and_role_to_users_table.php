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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('organization_id')->constrained()->restrictOnDelete();
            $table->string('role');
            $table->index('organization_id');

            $table->timestampTz('email_verified_at')->nullable()->change();
            $table->timestampTz('created_at')->nullable()->change();
            $table->timestampTz('updated_at')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();

            $table->dropConstrainedForeignId('organization_id');
            $table->dropColumn('role');
        });
    }
};