<?php

use App\Models\Organization;
use App\Models\Scopes\OrganizationScope;
use App\Support\Tenancy\CurrentOrganization;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\TenantRecord;

beforeEach(function () {
    // PostgreSQL rolls this table back together with the test transaction.
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

    $this->tenant = app(CurrentOrganization::class);
});

it('only returns records of the current organization', function () {
    $this->tenant->set($this->acme);

    expect(TenantRecord::pluck('name')->all())->toBe(['Acme truck']);
});

it('cannot find another organization\'s record by id', function () {
    $this->tenant->set($this->acme);

    $globexRecordId = DB::table('tenant_records')->where('name', 'Globex van')->value('id');

    expect(TenantRecord::find($globexRecordId))->toBeNull();
});

it('returns nothing when no organization is set', function () {
    expect(TenantRecord::count())->toBe(0);
});

it('assigns the current organization to new records', function () {
    $this->tenant->set($this->globex);

    $record = TenantRecord::create(['name' => 'Globex bus']);

    expect($record->organization_id)->toBe($this->globex->id);
});

it('refuses to create a record without an organization', function () {
    expect(fn () => TenantRecord::create(['name' => 'Orphan']))
        ->toThrow(LogicException::class);
});

it('allows explicit cross-organization queries for system jobs', function () {
    expect(TenantRecord::withoutGlobalScope(OrganizationScope::class)->count())->toBe(2);
});
