<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Only the AutoPulse frontend may read API responses in a browser.
    | The API authenticates with Bearer tokens instead of cookies, so
    | credentials support stays disabled and no CSRF cookie route is exposed.
    |
    | Retry-After is exposed so the frontend can show an exact countdown
    | when a request is rate limited (HTTP 429).
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Retry-After'],

    'max_age' => 0,

    'supports_credentials' => false,

];
