<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticateUser
{
    /**
     * Find the user by email and verify the password.
     *
     * @throws ValidationException
     */
    public function handle(string $email, string $password): User
    {
        $user = User::where('email', $email)->first();

        if (! $user) {
            // Spend the same time as a real password check, so response
            // timing does not reveal whether the email is registered.
            Hash::make($password);

            $this->fail();
        }

        if (! Hash::check($password, $user->password)) {
            $this->fail();
        }

        return $user;
    }

    /**
     * Throw the same generic error for every failed login.
     *
     * @throws ValidationException
     */
    private function fail(): never
    {
        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }
}
