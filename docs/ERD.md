# AutoPulse – Entity Relationship Diagram

## Diagram

```mermaid
erDiagram
    organizations ||--o{ users : "has members"
    organizations ||--o{ vehicles : "owns"
    organizations ||--o{ drivers : "employs"
    organizations ||--o{ alerts : "receives"
    vehicles ||--o{ vehicle_assignments : "assigned through"
    drivers ||--o{ vehicle_assignments : "assigned through"
    vehicles ||--o{ maintenance_schedules : "has"
    vehicles ||--o{ maintenance_records : "has"
    maintenance_schedules |o--o{ maintenance_records : "fulfilled by"
    users |o--o{ maintenance_records : "performs"
    vehicles ||--o{ telemetry_readings : "reports"
    vehicles |o--o{ alerts : "triggers"
    drivers |o--o{ alerts : "triggers"

    organizations {
        bigint id PK
        string name
        string slug UK
        timestamptz created_at
        timestamptz updated_at
    }

    users {
        bigint id PK
        bigint organization_id FK
        string name
        string email UK
        string password "Bcrypt hashed"
        string role "owner, manager, mechanic"
        timestamptz created_at
        timestamptz updated_at
    }

    vehicles {
        bigint id PK
        bigint organization_id FK
        string registration_no "Unique per organization"
        string vin "Vehicle Identification Number"
        string make
        string model
        smallint year
        string fuel_type "petrol, diesel, cng, electric, hybrid"
        string status "active, in_maintenance, retired"
        integer current_odometer_km
        string device_token_hash "SHA-256 hash, nullable"
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at "Soft delete"
    }

    drivers {
        bigint id PK
        bigint organization_id FK
        string name
        string license_no "Unique per organization"
        date license_expires_at
        string phone
        string status "active, inactive"
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at "Soft delete"
    }

    vehicle_assignments {
        bigint id PK
        bigint vehicle_id FK
        bigint driver_id FK
        timestamptz assigned_at
        timestamptz unassigned_at "Null means currently active"
        timestamptz created_at
        timestamptz updated_at
    }

    maintenance_schedules {
        bigint id PK
        bigint vehicle_id FK
        string service_type "oil_change, tyre_rotation, brake_inspection"
        integer interval_km "Nullable"
        integer interval_days "Nullable"
        integer next_due_km
        date next_due_at
        timestamptz created_at
        timestamptz updated_at
    }

    maintenance_records {
        bigint id PK
        bigint vehicle_id FK
        bigint maintenance_schedule_id FK "Nullable, for unscheduled repairs"
        bigint performed_by FK "users.id, nullable"
        string service_type
        integer odometer_km
        decimal cost "numeric(12,2)"
        string vendor
        text notes
        timestamptz performed_at
        timestamptz created_at
        timestamptz updated_at
    }

    telemetry_readings {
        bigint id PK
        bigint vehicle_id FK
        timestamptz recorded_at "Device timestamp"
        integer odometer_km
        smallint speed_kmh
        smallint fuel_level_pct
        smallint engine_temp_c
        decimal latitude "numeric(10,7)"
        decimal longitude "numeric(10,7)"
        timestamptz created_at "Server receive time"
    }

    alerts {
        bigint id PK
        bigint organization_id FK
        bigint vehicle_id FK "Nullable"
        bigint driver_id FK "Nullable"
        string type "maintenance_due, overspeed, high_engine_temp, license_expiry"
        string severity "info, warning, critical"
        string message
        timestamptz resolved_at "Null means open"
        timestamptz created_at
        timestamptz updated_at
    }
```

## Index Plan

PostgreSQL does not automatically index foreign key columns (unlike MySQL InnoDB),
so every index below is created explicitly in migrations.

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| users | (organization_id) | B-tree | Tenant scoping |
| vehicles | (organization_id, registration_no) | Unique | Prevent duplicate registrations within a tenant |
| vehicles | (organization_id, status) | B-tree | Filter vehicles by status |
| drivers | (organization_id, license_no) | Unique | Prevent duplicate licenses within a tenant |
| vehicle_assignments | (vehicle_id) WHERE unassigned_at IS NULL | Partial unique | Only one active driver per vehicle |
| vehicle_assignments | (driver_id) WHERE unassigned_at IS NULL | Partial unique | Only one active vehicle per driver |
| maintenance_schedules | (vehicle_id) | B-tree | Load schedules per vehicle |
| maintenance_records | (vehicle_id, performed_at) | B-tree | Service history ordered by date |
| telemetry_readings | (vehicle_id, recorded_at) | B-tree | Latest readings per vehicle |
| alerts | (organization_id, resolved_at) | B-tree | Fetch open alerts per tenant |

## Data Design Decisions

1. **Multi-tenancy via `organization_id`:** Top-level tables carry `organization_id`
   and are filtered automatically through an Eloquent global scope. Child tables
   (assignments, schedules, records, readings) inherit tenancy through their parent vehicle.
2. **Assignment history table:** Driver assignment is stored in `vehicle_assignments`
   instead of a `driver_id` column on `vehicles`, preserving a full audit trail.
3. **Partial unique indexes:** PostgreSQL partial indexes enforce "one active assignment"
   at the database level, so data stays correct even if application code has a bug.
4. **Money as `numeric(12,2)`:** Floating-point types cause rounding errors and are never used for currency.
5. **`timestamptz` in UTC:** All timestamps are stored in UTC and converted to local time only in the UI.
6. **Enums as strings + PHP backed enums:** Avoids PostgreSQL native enum types, which
   require migrations to add or rename values.
7. **Soft deletes on vehicles and drivers:** Historical records (maintenance, assignments)
   keep valid references after an entity is retired.
8. **Alerts use nullable foreign keys instead of polymorphic relations:** Polymorphic
   columns cannot have real foreign key constraints; two nullable FKs keep referential integrity.
9. **Hashed device tokens:** Only a SHA-256 hash is stored. A database leak does not expose usable device credentials.
10. **Separate `recorded_at` and `created_at` on telemetry:** Distinguishes when the device
    measured data from when the server received it, which matters for delayed or offline uploads.