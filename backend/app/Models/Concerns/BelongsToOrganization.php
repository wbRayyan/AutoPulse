<?php

namespace App\Models\Concerns;

use App\Models\Organization;
use App\Models\Scopes\OrganizationScope;
use App\Support\Tenancy\CurrentOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use LogicException;

/**
 * Makes a model tenant-owned: queries are limited to the current
 * organization and new records are assigned to it automatically.
 */
trait BelongsToOrganization
{
    public static function bootBelongsToOrganization(): void
    {
        static::addGlobalScope(new OrganizationScope);

        static::creating(function (Model $model): void {
            $model->organization_id ??= app(CurrentOrganization::class)->id();

            if ($model->organization_id === null) {
                throw new LogicException(sprintf(
                    'Cannot create [%s] without a current organization.',
                    $model::class,
                ));
            }
        });
    }

    /**
     * Get the organization that owns the model.
     *
     * @return BelongsTo<Organization, $this>
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
