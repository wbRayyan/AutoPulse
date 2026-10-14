<?php

it('returns the API status at the root URL', function () {
    $this->getJson('/')
        ->assertOk()
        ->assertExactJson([
            'name' => config('app.name'),
            'status' => 'ok',
        ]);
});
