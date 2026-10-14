<?php

namespace Tests\Fixtures;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Minimal tenant-owned model for testing the tenancy layer
 * before real models such as Vehicle exist.
 */
#[Fillable(['name'])]
class TenantRecord extends Model
{
    use BelongsToOrganization;

    protected $table = 'tenant_records';

    public $timestamps = false;
}
