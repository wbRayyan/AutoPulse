<?php

it('answers a preflight request from the frontend origin', function () {
    $this->withHeaders([
        'Origin' => 'http://localhost:5173',
        'Access-Control-Request-Method' => 'POST',
        'Access-Control-Request-Headers' => 'authorization, content-type',
    ])
        ->options('/api/v1/auth/login')
        ->assertNoContent()
        ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
});

it('lets the frontend origin read API responses, including errors', function () {
    $this->withHeaders(['Origin' => 'http://localhost:5173'])
        ->getJson('/api/v1/auth/me')
        ->assertUnauthorized()
        ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
});

it('does not grant access to other origins', function () {
    $response = $this->withHeaders(['Origin' => 'https://evil.example'])
        ->getJson('/api/v1/auth/me');

    expect($response->headers->get('Access-Control-Allow-Origin'))
        ->not->toBe('*')
        ->not->toBe('https://evil.example');
});

it('exposes the Retry-After header so the frontend can show a countdown', function () {
    $this->withHeaders(['Origin' => 'http://localhost:5173'])
        ->getJson('/api/v1/auth/me')
        ->assertUnauthorized()
        ->assertHeader('Access-Control-Expose-Headers', 'Retry-After');
});
