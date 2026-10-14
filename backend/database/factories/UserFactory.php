<?php

namespace Database\Factories;

use App\Enums\Role;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => Role::Mechanic,
        ];
    }

    /**
     * Indicate that the user is an organization owner.
     */
    public function owner(): static
    {
        return $this->state(fn (array $attributes) => ['role' => Role::Owner]);
    }

    /**
     * Indicate that the user is a fleet manager.
     */
    public function manager(): static
    {
        return $this->state(fn (array $attributes) => ['role' => Role::Manager]);
    }

    /**
     * Indicate that the user is a mechanic.
     */
    public function mechanic(): static
    {
        return $this->state(fn (array $attributes) => ['role' => Role::Mechanic]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => ['email_verified_at' => null]);
    }
}