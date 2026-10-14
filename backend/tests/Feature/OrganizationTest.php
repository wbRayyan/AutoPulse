<?php

use App\Models\User;
use Illuminate\Database\QueryException;

it('prevents deleting an organization that still has users', function () {
    $user = User::factory()->create();

    expect(fn () => $user->organization->delete())
        ->toThrow(QueryException::class);
});
