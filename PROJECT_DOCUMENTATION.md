# Ferienhaus Management System - Komplette Projektbeschreibung

## Projektübersicht

Das Ferienhaus Management System ist eine umfassende Plattform zur Verwaltung von Ferienhäusern, Buchungen, Reinigungsservices und Wäschebestellungen. Das System besteht aus einem Admin-Interface und separaten Provider-Portalen für Reinigungsdienstleister (Amela) und Wäscheservice (Teuni).

## Architektur

### Frontend
- **Next.js 14** mit App Router
- **TypeScript** für Typsicherheit
- **Tailwind CSS** für Styling
- **shadcn/ui** Komponenten-Bibliothek
- **PWA-Funktionalität** mit Service Worker

### Backend
- **Supabase** als Backend-as-a-Service
- **PostgreSQL** Datenbank
- **Row Level Security (RLS)** für Datenschutz
- **Real-time Subscriptions** für Live-Updates

## Datenbank-Schema und Verknüpfungen

### Kern-Entitäten

#### 1. Houses (Ferienhäuser)
\`\`\`sql
houses
├── id (uuid, PK)
├── name (text)
├── address (text)
├── max_guests (integer)
├── bathrooms (integer)
├── image_url (text)
├── image_filename (text)
├── ical_url (text)
├── linen_stock (jsonb)
├── ordered_linen (jsonb)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

**Verknüpfungen:**
- `bookings.house_id → houses.id` (1:n)
- `service_tasks.house_id → houses.id` (1:n)
- `linen_orders.house_id → houses.id` (1:n)
- `house_inventory.house_id → houses.id` (1:n)
- `house_cleaning_instructions.house_id → houses.id` (1:n)
- `house_ical_sources.house_id → houses.id` (1:n)
- `linen_set_definitions.house_id → houses.id` (1:1)

#### 2. Bookings (Buchungen)
\`\`\`sql
bookings
├── id (uuid, PK)
├── house_id (uuid, FK → houses.id)
├── guest_name (text)
├── guest_email (text)
├── guest_phone (text)
├── number_of_guests (integer)
├── check_in (timestamp)
├── check_out (timestamp)
├── status (enum: confirmed, cancelled, completed)
├── booking_amount (numeric)
├── currency (varchar)
├── external_booking_id (varchar)
├── external_id (text)
├── source (text)
├── platform (varchar)
├── import_platform (varchar)
├── notes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

**Verknüpfungen:**
- `service_tasks.booking_id → bookings.id` (1:n)
- `linen_orders.booking_id → bookings.id` (1:n)
- `linen_requirements.booking_id → bookings.id` (1:1)

#### 3. Service Providers (Dienstleister)
\`\`\`sql
service_providers
├── id (uuid, PK)
├── name (text)
├── alias (varchar) -- 'amela', 'teuni'
├── service_type (enum: cleaning, laundry)
├── service_types (array) -- ['cleaning'] oder ['laundry']
├── contact_email (text)
├── contact_phone (text)
├── contact_info (jsonb)
├── is_active (boolean)
├── has_portal (boolean)
├── portal_token (text)
├── portal_created_at (timestamp)
├── notes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

**Verknüpfungen:**
- `service_tasks.provider_id → service_providers.id` (n:1)
- `service_tasks.assigned_staff_id → service_providers.id` (n:1)
- `linen_orders.provider_id → service_providers.id` (n:1)
- `cleaning_staff.service_provider_id → service_providers.id` (n:1)
- `laundry_staff.service_provider_id → service_providers.id` (n:1)
- `profiles.provider_id → service_providers.id` (n:1)
- `provider_tokens.provider_id → service_providers.id` (n:1)

#### 4. Service Tasks (Service-Aufträge)
\`\`\`sql
service_tasks
├── id (uuid, PK)
├── booking_id (uuid, FK → bookings.id)
├── house_id (uuid, FK → houses.id)
├── provider_id (uuid, FK → service_providers.id)
├── assigned_staff_id (uuid, FK → service_providers.id)
├── service_type (enum: cleaning, laundry)
├── status (enum: scheduled, in_progress, completed, cancelled)
├── scheduled_date (date)
├── scheduled_time (time)
├── completed_at (timestamp)
├── notes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

**Verknüpfungen:**
- `cleaning_assignments.service_task_id → service_tasks.id` (1:1)
- `laundry_orders.service_task_id → service_tasks.id` (1:1)

### Reinigungsservice-Entitäten

#### 5. Cleaning Staff (Reinigungskräfte)
\`\`\`sql
cleaning_staff
├── id (uuid, PK)
├── service_provider_id (uuid, FK → service_providers.id)
├── name (varchar)
├── email (varchar)
├── phone (varchar)
├── address (text)
├── hourly_rate (numeric)
├── availability_days (array)
├── is_active (boolean)
├── quality_rating (numeric)
├── total_assignments (integer)
├── completed_assignments (integer)
├── notes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

#### 6. Cleaning Assignments (Reinigungsaufträge)
\`\`\`sql
cleaning_assignments
├── id (uuid, PK)
├── service_task_id (uuid, FK → service_tasks.id)
├── cleaning_staff_id (uuid, FK → cleaning_staff.id)
├── status (varchar)
├── assigned_at (timestamp)
├── confirmed_at (timestamp)
├── started_at (timestamp)
├── completed_at (timestamp)
├── estimated_duration (integer)
├── actual_duration (integer)
├── special_instructions (text)
├── confirmation_token (varchar)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

**Verknüpfungen:**
- `cleaning_confirmations.cleaning_assignment_id → cleaning_assignments.id` (1:1)

#### 7. House Cleaning Instructions (Reinigungsanweisungen)
\`\`\`sql
house_cleaning_instructions
├── id (uuid, PK)
├── house_id (uuid, FK → houses.id)
├── room_type (varchar)
├── instructions (text)
├── priority (integer)
├── estimated_duration (integer)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

### Wäscheservice-Entitäten

#### 8. Laundry Staff (Wäschekräfte)
\`\`\`sql
laundry_staff
├── id (uuid, PK)
├── service_provider_id (uuid, FK → service_providers.id)
├── name (varchar)
├── email (varchar)
├── phone (varchar)
├── address (text)
├── hourly_rate (numeric)
├── availability_days (array)
├── is_active (boolean)
├── quality_rating (numeric)
├── total_orders (integer)
├── completed_orders (integer)
├── notes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

#### 9. Linen Orders (Wäschebestellungen)
\`\`\`sql
linen_orders
├── id (uuid, PK)
├── booking_id (uuid, FK → bookings.id)
├── house_id (uuid, FK → houses.id)
├── provider_id (uuid, FK → service_providers.id)
├── status (text)
├── order_date (date)
├── delivery_date (date)
├── delivery_time (time)
├── items (jsonb)
├── item_variants (jsonb)
├── total_items (integer)
├── notes (text)
├── email_sent_at (timestamp)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

**Verknüpfungen:**
- `laundry_order_items.laundry_order_id → linen_orders.id` (1:n)
- `laundry_confirmations.laundry_order_id → linen_orders.id` (1:1)

#### 10. Laundry Orders (Detaillierte Wäscheaufträge)
\`\`\`sql
laundry_orders
├── id (uuid, PK)
├── service_task_id (uuid, FK → service_tasks.id)
├── laundry_staff_id (uuid, FK → laundry_staff.id)
├── status (varchar)
├── assigned_at (timestamp)
├── confirmed_at (timestamp)
├── started_at (timestamp)
├── completed_at (timestamp)
├── pickup_date (date)
├── delivery_date (date)
├── estimated_duration (integer)
├── actual_duration (integer)
├── special_instructions (text)
├── confirmation_token (varchar)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

### Unterstützende Entitäten

#### 11. House Inventory (Hausinventar)
\`\`\`sql
house_inventory
├── id (uuid, PK)
├── house_id (uuid, FK → houses.id)
├── name (varchar)
├── category (varchar)
├── quantity (integer)
├── expected_quantity (integer)
├── condition (varchar)
├── location (varchar)
├── is_template (boolean)
├── last_checked (timestamp)
├── notes (text)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

#### 12. Linen Requirements (Wäscheanforderungen)
\`\`\`sql
linen_requirements
├── id (uuid, PK)
├── house_id (uuid, FK → houses.id)
├── booking_id (uuid, FK → bookings.id)
├── bedding (integer)
├── pillow_cases (integer)
├── blankets (integer)
├── large_towels (integer)
├── small_towels (integer)
├── sauna_towels (integer)
├── sink_towels (integer)
├── bath_mats (integer)
├── kitchen_towels (integer)
├── table_linens (integer)
├── custom_categories (jsonb)
├── created_at (timestamp)
└── updated_at (timestamp)
\`\`\`

## API-Endpunkte

### Admin APIs
- `GET /api/bookings` - Alle Buchungen mit Services laden
- `GET /api/houses` - Alle Häuser laden
- `GET /api/service-tasks` - Alle Service-Aufträge laden
- `GET /api/service-providers` - Alle Dienstleister laden
- `POST /api/bookings` - Neue Buchung erstellen
- `PATCH /api/bookings/[id]` - Buchung aktualisieren
- `DELETE /api/bookings/[id]` - Buchung löschen

### Provider APIs
- `GET /api/provider/bookings/detailed` - Detaillierte Buchungen für Provider
- `GET /api/provider/staff` - Staff-Mitglieder für Provider
- `POST /api/provider/staff` - Neuen Staff erstellen
- `PATCH /api/provider/staff/[id]` - Staff aktualisieren
- `DELETE /api/provider/staff/[id]` - Staff löschen
- `GET /api/provider/calendar` - Kalender-Events für Provider
- `GET /api/provider/manifest/[providerId]` - PWA-Manifest für Provider

### Utility APIs
- `GET /api/provider/resolve-alias/[alias]` - Alias zu Provider-ID auflösen
- `GET /api/ical-import` - iCal-Import für Buchungen
- `POST /api/houses/upload-image` - Haus-Bild hochladen

## Frontend-Komponenten-Struktur

### Admin Interface
- `components/booking-overview.tsx` - Buchungsübersicht mit Services
- `components/service-tasks-overview.tsx` - Service-Aufträge-Verwaltung
- `components/provider-management-interface.tsx` - Provider-Verwaltung
- `components/house-management.tsx` - Häuser-Verwaltung

### Provider Portals
- `app/provider/[providerId]/page.tsx` - Haupt-Provider-Portal
- `components/staff-management.tsx` - Staff-Verwaltung
- `components/detailed-booking-card.tsx` - Detaillierte Buchungsansicht
- `components/simplified-cleaning-calendar.tsx` - Reinigungskalender
- `components/simplified-laundry-calendar.tsx` - Wäschekalender

### Shared Components
- `components/ui/*` - shadcn/ui Basis-Komponenten
- `components/pwa-install-prompt.tsx` - PWA-Installation
- `components/qr-code-scanner.tsx` - QR-Code-Scanner

## Geschäftslogik

### Buchungsworkflow
1. **Buchung erstellen** - Manuell oder via iCal-Import
2. **Service-Tasks generieren** - Automatisch basierend auf Buchungsdaten
3. **Provider zuweisen** - Reinigung (Amela) oder Wäsche (Teuni)
4. **Staff zuweisen** - Spezifische Mitarbeiter für Aufträge
5. **Ausführung verfolgen** - Status-Updates und Bestätigungen

### Provider-Portal-Logik
- **Amela Portal** (Reinigung):
  - Blaues Theme
  - 4 Tabs: Reinigungen, Kalender, Reinigungskräfte, Reinigungsinfo
  - Cleaning-spezifische Funktionen
  
- **Teuni Portal** (Wäsche):
  - Grünes Theme
  - 4 Tabs: Wäsche, Kalender, Wäschekräfte, Wäscheinfo
  - Laundry-spezifische Funktionen

### PWA-Funktionalität
- **Separate App-Identitäten** für Amela und Teuni
- **Offline-Funktionalität** mit Service Worker
- **Push-Benachrichtigungen** für neue Aufträge
- **Provider-spezifische Icons** und Manifeste

## Kritische Verknüpfungen

### Supabase Relationship-Spezifikationen
\`\`\`typescript
// Service Tasks mit Provider-Informationen
service_tasks.select(`
  *,
  service_providers!provider_id(name),
  assigned_staff:service_providers!assigned_staff_id(name)
`)

// Buchungen mit Services
bookings.select(`
  *,
  service_tasks(*, service_providers!provider_id(name)),
  linen_orders(*, service_providers!provider_id(name))
`)
\`\`\`

### Foreign Key-Constraints
- Alle UUID-Referenzen müssen explizit spezifiziert werden
- `!provider_id` und `!assigned_staff_id` für eindeutige Beziehungen
- RLS-Policies für Provider-spezifischen Datenzugriff

## Deployment und Konfiguration

### Environment Variables
- `SUPABASE_URL` - Supabase-Projekt-URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service-Role-Key für Admin-Operationen
- `SUPABASE_ANON_KEY` - Anonymer Key für Client-Operationen
- `NEXT_PUBLIC_SUPABASE_URL` - Öffentliche Supabase-URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Öffentlicher anonymer Key
- `NEXT_PUBLIC_APP_URL` - Basis-URL der Anwendung

### PWA-Konfiguration
- Provider-spezifische Manifeste unter `/api/provider/manifest/[providerId]`
- Service Worker für Offline-Funktionalität
- Separate App-Scopes für Amela und Teuni

## Bekannte Probleme und Lösungen

### Datenbank-Relationship-Konflikte
- **Problem**: Mehrere Foreign Keys zu `service_providers` verursachen PGRST201-Fehler
- **Lösung**: Explizite Foreign Key-Spezifikation mit `!column_name`

### Provider-Portal-Trennung
- **Problem**: Einheitliche PWA-Identität für beide Provider
- **Lösung**: Separate Manifeste, Icons und App-Scopes

### Staff-Management
- **Problem**: Separate Tabellen für `cleaning_staff` und `laundry_staff`
- **Lösung**: Einheitliche `service_provider_staff` Tabelle mit `service_type`

Diese Dokumentation dient als zentrale Referenz für die Systemarchitektur und sollte bei allen Entwicklungsarbeiten konsultiert werden.
