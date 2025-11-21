# Database Migrations

This directory contains SQL migrations for setting up the Col-Legit database in Supabase.

## Quick Start

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - `20241120000000_initial_schema.sql`
   - `20241120000001_rls_policies.sql`
4. Run each migration by clicking **Run**

### Option 2: Apply via Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't
npm install -D supabase

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
npx supabase db push
```

## Migrations Overview

### 20241120000000_initial_schema.sql

Creates all the core tables:
- **profiles** - User profiles linked to auth.users
- **colleges** - Master list of colleges
- **user_colleges** - User's college application list
- **tasks** - Tasks for each application
- **gamification_state** - XP, levels, and streaks
- **achievements** - Achievement definitions
- **user_achievements** - Unlocked achievements per user

Also includes:
- Indexes for optimal query performance
- Triggers for automatic `updated_at` timestamps
- Seed data for achievements

### 20241120000001_rls_policies.sql

Sets up Row Level Security (RLS) policies to ensure:
- Users can only access their own data
- Public data (colleges, achievements) is accessible to all authenticated users
- Automatic gamification_state creation when a profile is created

## Verifying Migrations

After running the migrations, verify they were applied correctly:

1. In Supabase Dashboard, go to **Database** → **Tables**
2. You should see all 7 tables listed
3. Check **Authentication** → **Policies** to see RLS policies

## Database Schema Diagram

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
    ├── user_colleges → colleges
    │       ↓
    │   tasks (many)
    │
    ├── gamification_state (1:1)
    │
    └── user_achievements → achievements
```

## Rollback

If you need to drop all tables (⚠️ WARNING: This deletes all data):

```sql
-- Drop tables in reverse order due to foreign keys
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS gamification_state;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS user_colleges;
DROP TABLE IF EXISTS colleges;
DROP TABLE IF EXISTS profiles;
```

## Next Steps

After applying migrations:
1. Test authentication flow
2. Create a test user and profile
3. Verify RLS policies work correctly
4. Start building the application features
