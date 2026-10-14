<?php

use App\Http\Controllers\Api\V1\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('v1.')->group(function () {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', RegisterController::class)
            ->middleware('throttle:10,1')
            ->name('register');
    });
});