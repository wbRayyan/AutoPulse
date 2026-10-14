<?php

use App\Enums\Role;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->manager()->create([
        'email' => 'manager@example.com',
    ]);
});

it('logs in with valid credentials and returns a token', function () {
    $this->postJson('/api/v1/auth/login', [
        'email' => 'manager@example.com',
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'user' => ['id', 'name', 'email', 'role', 'organization' => ['id', 'name', 'slug']],
                'token',
            ],
        ])
        ->assertJsonPath('data.user.id', $this->user->id)
        ->assertJsonPath('data.user.role', Role::Manager->value);

    expect($this->user->tokens()->count())->toBe(1);
});

it('accepts the email address in any letter case', function () {
    $this->postJson('/api/v1/auth/login', [
        'email' => 'Manager@Example.COM',
        'password' => 'password',
    ])->assertOk();
});

it('rejects a wrong password without issuing a token', function () {
    $this->postJson('/api/v1/auth/login', [
        'email' => 'manager@example.com',
        'password' => 'wrong-password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email'])
        ->assertJsonMissingPath('data.token');

    expect($this->user->tokens()->count())->toBe(0);
});

it('returns the same error for an unknown email and a wrong password', function () {
    $wrongPassword = $this->postJson('/api/v1/auth/login', [
        'email' => 'manager@example.com',
        'password' => 'wrong-password',
    ])->json('errors.email.0');

    $unknownEmail = $this->postJson('/api/v1/auth/login', [
        'email' => 'nobody@example.com',
        'password' => 'wrong-password',
    ])->json('errors.email.0');

    expect($unknownEmail)->toBeString()->toBe($wrongPassword);
});

it('requires an email and a password', function () {
    $this->postJson('/api/v1/auth/login', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});

it('blocks further attempts after five failed logins', function () {
    foreach (range(1, 5) as $attempt) {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'manager@example.com',
            'password' => 'wrong-password',
        ]);
    }

    $this->postJson('/api/v1/auth/login', [
        'email' => 'manager@example.com',
        'password' => 'password',
    ])->assertTooManyRequests();
});
