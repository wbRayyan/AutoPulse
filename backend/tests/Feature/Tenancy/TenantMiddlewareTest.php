<?php

use App\Models\Organization;
use App\Models\User;
use App\Support\Tenancy\CurrentOrganization;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Tests\Fixtures\TenantRecord;

beforeEach(function () {
    Schema::create('tenant_records', function (Blueprint $table) {
        $table->id();
        $table->foreignId('organization_id')->constrained();
        $table->string('name');
    });

    $this->acme = Organization::factory()->create();
    $this->globex = Organization::factory()->create();

    DB::table('tenant_records')->insert([
        ['organization_id' => $this->acme->id, 'name' => 'Acme truck'],
        ['organization_id' => $this->globex->id, 'name' => 'Globex van'],
    ]);

    // Test-only endpoints that pass through the same middleware as real tenant routes.
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        Route::get('/api/test/current-organization', fn () => [
            'id' => app(CurrentOrganization::class)->id(),
        ]);

        Route::get('/api/test/tenant-records', fn () => TenantRecord::orderBy('name')->pluck('name'));
    });
});

it('sets the current organization from the authenticated user', function () {
    Sanctum::actingAs(User::factory()->for($this->acme)->create());

    $this->getJson('/api/test/current-organization')
        ->assertOk()
        ->assertExactJson(['id' => $this->acme->id]);
});

it('shows a user only the records of their own organization', function () {
    Sanctum::actingAs(User::factory()->for($this->acme)->create());

    $this->getJson('/api/test/tenant-records')
        ->assertOk()
        ->assertExactJson(['Acme truck']);
});

it('shows another organization only its own records', function () {
    Sanctum::actingAs(User::factory()->for($this->globex)->create());

    $this->getJson('/api/test/tenant-records')
        ->assertOk()
        ->assertExactJson(['Globex van']);
});

it('rejects guests before any tenant data is touched', function () {
    $this->getJson('/api/test/tenant-records')
        ->assertUnauthorized();
});
