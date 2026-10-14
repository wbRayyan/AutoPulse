<?php

use App\Enums\Role;

it('defines exactly the three supported roles', function () {
    $values = array_map(fn (Role $role) => $role->value, Role::cases());

    expect($values)->toBe(['owner', 'manager', 'mechanic']);
});
