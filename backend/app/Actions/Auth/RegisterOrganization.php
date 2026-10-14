<?php

namespace App\Actions\Auth;

use App\Enums\Role;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegisterOrganization
{
    /**
     * Create a new organization together with its owner account.
     *
     * @param  array{organization_name: string, name: string, email: string, password: string}  $data
     */
    public function handle(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $organization = Organization::create([
                'name' => $data['organization_name'],
                'slug' => $this->uniqueSlug($data['organization_name']),
            ]);

            $owner = new User([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $owner->role = Role::Owner;
            $owner->organization()->associate($organization);
            $owner->save();

            return $owner;
        });
    }

    /**
     * Build a URL-friendly slug that no other organization uses yet.
     */
    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'organization';
        $slug = $base;

        while (Organization::where('slug', $slug)->exists()) {
            $slug = $base.'-'.Str::lower(Str::random(6));
        }

        return $slug;
    }
}