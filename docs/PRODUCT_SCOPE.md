# AutoPulse – Product Scope (MVP)

## 1. Overview

AutoPulse is a multi-tenant SaaS platform that helps small and mid-sized
fleet operators (logistics companies, rental services, school transport)
track vehicle health, schedule preventive maintenance, and monitor
real-time telematics data from a single dashboard.

## 2. Problem Statement

Fleet operators commonly track maintenance in spreadsheets or paper logs.
This leads to missed service intervals, unexpected breakdowns, expired
driver licenses, and no visibility into vehicle condition between services.

## 3. Target Users & Roles

| Role          | Description                         | Key Permissions                                      |
|---------------|-------------------------------------|------------------------------------------------------|
| Owner         | Company account holder              | Full access, manage team members                     |
| Fleet Manager | Day-to-day fleet operations         | Manage vehicles, drivers, assignments, schedules     |
| Mechanic      | Performs vehicle servicing          | View vehicles, log maintenance records               |

## 4. Core Views & User Stories

### 4.1 Dashboard
- As a Fleet Manager, I want to see total, active and in-maintenance vehicles so that I understand fleet availability at a glance.
- As a Fleet Manager, I want to see overdue and upcoming maintenance so that I can act before breakdowns occur.
- As an Owner, I want to see unresolved critical alerts so that urgent issues are never missed.

### 4.2 Vehicles
- As a Fleet Manager, I want to add, edit and retire vehicles so that the fleet registry stays accurate.
- As a Fleet Manager, I want to search and filter vehicles by status and registration number so that I can find a vehicle quickly.
- As a Fleet Manager, I want a vehicle detail page with maintenance history, current driver and recent telemetry so that I see its full picture in one place.

### 4.3 Drivers & Assignments
- As a Fleet Manager, I want to manage driver profiles including license expiry so that only valid drivers operate vehicles.
- As a Fleet Manager, I want to assign and unassign drivers to vehicles so that responsibility is always clear.
- As an Owner, I want a full assignment history so that I can trace who operated a vehicle at any point in time.

### 4.4 Maintenance
- As a Fleet Manager, I want to define service schedules by distance (km) or time (days) so that preventive maintenance is automated.
- As a Mechanic, I want to log completed services with odometer reading, cost and vendor so that records are complete.
- As a Fleet Manager, I want the next due date and mileage to update automatically after a service so that schedules never go stale.

### 4.5 Telematics & Alerts
- As a system integrator, I want each vehicle device to securely send readings (odometer, speed, fuel level, engine temperature, location) via an API so that data flows in automatically.
- As a Fleet Manager, I want alerts for overspeeding, high engine temperature, due maintenance and expiring licenses so that I can respond quickly.
- As a Fleet Manager, I want to resolve alerts so that the alert feed reflects only open issues.

### 4.6 Supporting Screens
- Authentication: register organization, login, logout.
- Team & Settings: invite users, assign roles, update organization profile.

## 5. Non-Functional Requirements

- **Security:** Token-based authentication (Laravel Sanctum), role-based authorization via Policies, strict tenant data isolation.
- **Performance:** Paginated list endpoints, eager-loaded relationships (no N+1 queries), indexed foreign keys and filter columns.
- **Reliability:** Telemetry ingestion and alert generation processed asynchronously via queues.
- **Quality:** Automated feature tests for every API endpoint, enforced code style, CI pipeline on every push.
- **Developer Experience:** Fully containerized local environment using Docker Compose.

## 6. Out of Scope (MVP)

- Live GPS map tracking
- Integration with physical OBD-II / GPS hardware (simulated via an Artisan command)
- Billing and subscription management
- Mobile application
- Email / SMS notifications
- Fuel card and expense management

## 7. Success Criteria

- All five core views are fully functional end-to-end.
- Every API endpoint is covered by automated tests.
- A new developer can run the project locally with a single `docker compose up` command.
- Live demo deployed with seeded sample data.