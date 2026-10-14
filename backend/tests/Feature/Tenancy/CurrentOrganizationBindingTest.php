<?php

use App\Support\Tenancy\CurrentOrganization;

it('shares one tenant context within a request or job', function () {
    expect(app(CurrentOrganization::class))->toBe(app(CurrentOrganization::class));
});
