<?php

use App\Models\User;

it('returns the authenticated user with the organization', function () {
    $user = User::factory()->owner()->create();
    $token = $user->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->getJson('/api/v1/auth/me')
        ->assertOk()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.role', 'owner')
        ->assertJsonPath('data.organization.id', $user->organization_id)
        ->assertJsonMissingPath('data.password');
});

it('rejects a request without a token', function () {
    $this->getJson('/api/v1/auth/me')
        ->assertUnauthorized();
});

it('rejects an invalid token', function () {
    $this->withToken('1|not-a-real-token')
        ->getJson('/api/v1/auth/me')
        ->assertUnauthorized();
});

it('answers with JSON even when the client does not ask for it', function () {
    $this->get('/api/v1/auth/me')
        ->assertUnauthorized()
        ->assertJson(['message' => 'Unauthenticated.']);
});
