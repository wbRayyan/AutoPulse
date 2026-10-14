<?php

use App\Support\Tenancy\CurrentOrganization;

it('starts without an organization', function () {
    $current = new CurrentOrganization;

    expect($current->check())->toBeFalse()
        ->and($current->id())->toBeNull();
});

it('stores and clears the organization id', function () {
    $current = new CurrentOrganization;

    $current->set(7);

    expect($current->id())->toBe(7)
        ->and($current->check())->toBeTrue();

    $current->clear();

    expect($current->check())->toBeFalse();
});

it('restores the previous organization after runAs', function () {
    $current = new CurrentOrganization;
    $current->set(1);

    $seenInside = $current->runAs(2, fn () => $current->id());

    expect($seenInside)->toBe(2)
        ->and($current->id())->toBe(1);
});

it('restores the previous organization even when the callback fails', function () {
    $current = new CurrentOrganization;
    $current->set(1);

    expect(fn () => $current->runAs(2, fn () => throw new RuntimeException('Job failed')))
        ->toThrow(RuntimeException::class);

    expect($current->id())->toBe(1);
});
