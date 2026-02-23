# CCIS Connect

CCIS Connect is a CodeIgniter 3 web application for:
- Public pages (`homepage`, `about`, `updates`, `academics`, `forms`, `faculty`, `alumni`, `organization`)
- Role-based login and dashboards
- Superadmin content management
- Organization admin posting and profile management

## Requirements

- PHP 7.4+ (8.x works in most local setups)
- MySQL/MariaDB
- Apache/Nginx (project is currently configured for Apache/WAMP style local hosting)

## Setup

1. Clone the repository into your web root.
2. Copy `.env.example` to `.env`.
3. Update `.env` with your local values.
4. Ensure your local virtual host/base URL matches `APP_BASE_URL`.
5. Make sure writable directories exist:
- `application/logs`
- `application/cache`
- `uploads` and its subdirectories

## Environment Configuration

The app now reads environment values from:
1. System environment variables
2. Project `.env` file in the repository root

Main keys:

```env
APP_BASE_URL=http://localhost/ccis_connect
APP_ENCRYPTION_KEY=change_this_to_a_long_random_key
APP_COOKIE_SECURE=false
APP_SESSION_SAVE_PATH=

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ccis_condb
DB_DRIVER=mysqli
```

Important:
- Do not commit `.env`.
- Keep production credentials outside the repository.

## Database Setup

1. Create the database:
- `ccis_condb` (or set a custom name via `DB_NAME`)

2. Import schema/data:
- If you have an SQL dump, import it into your target database.
- If starting fresh, this project includes migrations for:
  - `faculty_users`
  - `programs`
  - `curriculum`
  - `forms`

3. Additional tables are created/ensured at runtime by some models/controllers (for specific modules).

## Migrations

Migration config is at `application/config/migration.php`.

Current notes:
- `migration_enabled` is enabled.
- Migration files exist in `application/migrations`.
- If you use a migration runner/controller, set `migration_version` to the latest migration number when ready.

## Default Role Mapping

Based on `application/controllers/LoginController.php`, role ID mapping is:

- `1` = `superadmin`
- `2` = `faculty`
- `3` = `student`
- `4` = `org_admin`

Ensure your `roles` and `user_roles` tables match this mapping for correct login redirects and permissions.

## Local Development Tips

- Base URL config is read from `APP_BASE_URL`.
- Database credentials are read from `.env` via `application/config/env_loader.php`.
- For local HTTP (non-HTTPS), keep `APP_COOKIE_SECURE=false`.

## Security Checklist

- Set a strong `APP_ENCRYPTION_KEY`.
- Use HTTPS and `APP_COOKIE_SECURE=true` in production.
- Keep `.env` and SQL backups out of version control.

## Quick Health Check Endpoints

- `/login`
- `/forms`
- `/updates`
- `/updates/api/announcements`
- `/alumni`
- `/organization`

