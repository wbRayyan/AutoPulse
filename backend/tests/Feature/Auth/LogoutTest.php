<?php

use App\Models\User;

it('revokes only the token used for the request', function () {
    $user = User::factory()->create();
    $laptopToken = $user->createToken('laptop')->plainTextToken;
    $user->createToken('phone');

    $this->withToken($laptopToken)
        ->postJson('/api/v1/auth/logout')
        ->assertNoContent();

    expect($user->tokens()->pluck('name')->all())->toBe(['phone']);
});

it('makes the revoked token unusable', function () {
    $user = User::factory()->create();
    $token = $user->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->postJson('/api/v1/auth/logout')
        ->assertNoContent();

    // The auth guard caches the user for the whole test application,
    // so reset it to behave like a brand-new request.
    app('auth')->forgetGuards();

    $this->withToken($token)
        ->getJson('/api/v1/auth/me')
        ->assertUnauthorized();
});

it('requires authentication', function () {
    $this->postJson('/api/v1/auth/logout')
        ->assertUnauthorized();
});
