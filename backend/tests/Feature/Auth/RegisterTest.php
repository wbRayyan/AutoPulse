<?php

use App\Enums\Role;
use App\Models\Organization;
use App\Models\User;

beforeEach(function () {
    $this->payload = [
        'organization_name' => 'Wah Logistics',
        'name' => 'Rayan Bhatti',
        'email' => 'rayan@example.com',
        'password' => 'Secret-Password-123',
        'password_confirmation' => 'Secret-Password-123',
    ];
});

it('registers an organization with its owner and returns a token', function () {
    $this->postJson('/api/v1/auth/register', $this->payload)
        ->assertCreated()
        ->assertJsonStructure([
            'data' => [
                'user' => ['id', 'name', 'email', 'role', 'organization' => ['id', 'name', 'slug']],
                'token',
            ],
        ])
        ->assertJsonPath('data.user.role', 'owner')
        ->assertJsonPath('data.user.organization.slug', 'wah-logistics')
        ->assertJsonMissingPath('data.user.password');

    $user = User::where('email', 'rayan@example.com')->firstOrFail();

    expect($user->role)->toBe(Role::Owner)
        ->and($user->organization->name)->toBe('Wah Logistics')
        ->and($user->tokens()->count())->toBe(1);
});

it('ignores privileged fields sent by the client', function () {
    $otherOrganization = Organization::factory()->create();

    $this->postJson('/api/v1/auth/register', [
        ...$this->payload,
        'role' => 'mechanic',
        'organization_id' => $otherOrganization->id,
    ])->assertCreated();

    $user = User::where('email', 'rayan@example.com')->firstOrFail();

    expect($user->role)->toBe(Role::Owner)
        ->and($user->organization_id)->not->toBe($otherOrganization->id);
});

it('generates a unique slug when the organization name is already taken', function () {
    Organization::factory()->create(['name' => 'Wah Logistics', 'slug' => 'wah-logistics']);

    $this->postJson('/api/v1/auth/register', $this->payload)
        ->assertCreated()
        ->assertJsonPath('data.user.organization.name', 'Wah Logistics');

    expect(Organization::where('name', 'Wah Logistics')->pluck('slug')->unique())
        ->toHaveCount(2);
});

it('rejects an email that is already registered', function () {
    User::factory()->create(['email' => 'rayan@example.com']);

    $this->postJson('/api/v1/auth/register', $this->payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('requires all registration fields', function () {
    $this->postJson('/api/v1/auth/register', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['organization_name', 'name', 'email', 'password']);
});