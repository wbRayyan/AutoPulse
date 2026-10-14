<?php

namespace App\Support\Tenancy;

use App\Models\Organization;

/**
 * Holds the organization (tenant) the current request or job acts for.
 */
class CurrentOrganization
{
    private ?int $id = null;

    public function set(Organization|int $organization): void
    {
        $this->id = $organization instanceof Organization
            ? $organization->getKey()
            : $organization;
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function check(): bool
    {
        return $this->id !== null;
    }

    public function clear(): void
    {
        $this->id = null;
    }

    /**
     * Run a callback as the given organization, then restore the previous one.
     *
     * @template TResult
     *
     * @param  callable(): TResult  $callback
     * @return TResult
     */
    public function runAs(Organization|int $organization, callable $callback): mixed
    {
        $previous = $this->id;

        $this->set($organization);

        try {
            return $callback();
        } finally {
            $this->id = $previous;
        }
    }
}
