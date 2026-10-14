<?php

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('v1.')->group(function () {
    // Public authentication endpoints.
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', RegisterController::class)
            ->middleware('throttle:10,1')
            ->name('register');

        Route::post('login', LoginController::class)
            ->middleware('throttle:login')
            ->name('login');
    });

    // Authenticated endpoints, scoped to the user's organization.
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('me', MeController::class)->name('me');
            Route::post('logout', LogoutController::class)->name('logout');
        });

        // Tenant resources (vehicles, drivers, alerts) are added here in later phases.
    });
});
