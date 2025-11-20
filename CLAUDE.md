# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project: Gamified College Application Tracker

## One line summary

A modern web app that helps students plan, track, and finish college applications, with XP, streaks, and achievements that make the process feel like a game instead of a grind.

## Tech stack

- Frontend: Next.js (App Router) with TypeScript
- Data fetching and server state: TanStack Query
- UI:
  - Tailwind CSS
  - shadcn/ui for basic components (buttons, cards, dialogs, inputs)
  - React Hook Form + Zod for forms and validation
- Backend:
  - Supabase (Postgres, Auth, Storage, Row Level Security)
  - Supabase JS client
- Testing:
  - Vitest for unit tests
  - Playwright or Cypress for basic end to end flows
- Tooling:
  - ESLint, Prettier, and TypeScript strict mode
  - pnpm or npm for package management

When you create or modify code, follow this stack unless explicitly asked to do something different.

## Core users and personas

1. **Student**
   - High school or community college student
   - Wants a single place to see deadlines, tasks, and requirements
   - Responds well to progress bars, XP, streaks, and achievements

2. **Parent or mentor** (later phase)
   - Mostly needs high level overview of progress
   - Might get invited to view a read only dash

For now, assume only the Student persona is implemented.

## Primary features

When adding features or files, keep them aligned to these core flows:

1. **Onboarding**
   - Student creates an account with Supabase Auth
   - Sets graduation year and general interests (STEM, humanities, arts etc.)
   - Gets a starter checklist and some starter XP for completing onboarding

2. **College list management**
   - Add colleges to a personal list
   - Save basic info: school name, type, location, application type (ED, EA, RD), deadlines, and links
   - Tag schools (reach, match, safety)

3. **Application tracker**
   - Each college has:
     - Status (not started, researching, in progress, submitted, decision received)
     - Tasks (essays, recommendations, test score sends, portfolio uploads)
     - Deadlines and reminders
   - Simple visual progress bar per school and overall

4. **Task system**
   - Tasks with due dates and optional reminders
   - Tasks can be generic or tied to a specific school
   - Support recurring habits such as "work on essays for 30 minutes"

5. **Gamification**
   - XP for completing tasks and milestones
   - Leveling system based on total XP
   - Streaks for days with at least one completed task
   - A small set of achievements, for example:
     - Added first 5 schools
     - Finished all tasks for one college
     - Maintained a 7 day streak
   - Keep it encouraging and positive, not punishing

6. **Timeline and calendar view**
   - A timeline of upcoming deadlines
   - Calendar style view is a nice to have, not required for v1

## Data model (first pass)

Use this as the starting point when designing database schemas and TypeScript types.

- `profiles`
  - `id` (uuid, ties to auth user)
  - `full_name`
  - `grad_year`
  - `interests` (string array)
  - `created_at`

- `colleges`
  - `id`
  - `name`
  - `slug`
  - `location`
  - `type` (public, private, community, other)
  - `metadata` (jsonb for extra info)

- `user_colleges`
  - `id`
  - `user_id`
  - `college_id`
  - `application_round` (ED, EA, RD, rolling)
  - `app_deadline`
  - `status` (not_started, researching, in_progress, submitted, decision_received)
  - `decision` (pending, accepted, rejected, waitlisted)
  - `notes`
  - `created_at`
  - `updated_at`

- `tasks`
  - `id`
  - `user_id`
  - `user_college_id` (nullable if general task)
  - `title`
  - `description`
  - `due_date`
  - `status` (todo, in_progress, done)
  - `type` (essay, recommendation, test_score, admin, habit)
  - `created_at`
  - `updated_at`

- `gamification_state`
  - `user_id`
  - `xp`
  - `level`
  - `current_streak`
  - `longest_streak`
  - `last_activity_date`

- `achievements`
  - `id`
  - `code` (unique string identifier)
  - `name`
  - `description`
  - `xp_reward`

- `user_achievements`
  - `user_id`
  - `achievement_id`
  - `unlocked_at`

This can evolve, but keep it consistent and well typed.

## Architecture guidelines

- Use the Next.js App Router with the `app/` directory.
- Prefer server components where possible and client components only where needed for interactivity.
- Use TanStack Query for data fetching that depends on the browser and needs caching or refetching.
- Use Supabase in the following way:
  - Server components and route handlers should use a Supabase client bound to the server environment.
  - Client components should use the browser Supabase client only when unavoidable.
- Encapsulate Supabase calls inside a small set of data access modules instead of sprinkling queries through components.

Suggested directories:

- `app/` for routes
- `app/(marketing)` for public landing pages
- `app/(app)` for authenticated app views
- `components/` for shared UI components
- `components/features/*` for feature specific components
- `lib/supabase/` for Supabase clients and helpers
- `lib/db/` for data access functions
- `lib/gamification/` for XP and level calculations
- `types/` for shared TypeScript types
- `hooks/` for React hooks that encapsulate TanStack Query logic

## UX and design principles

- Target audience is stressed students. The UI should feel calm, clear, and encouraging.
- Keep the layout simple. A dashboard and a few detail screens are better than a maze of pages.
- Prefer:
  - Clear progress indicators
  - Simple language
  - Mobile friendly layouts
- Avoid dark patterns or guilt based notifications. Any gamification should encourage and celebrate progress.

## Coding standards

- Use modern React patterns with function components.
- Use TypeScript in strict mode.
- All new code should pass ESLint and Prettier.
- Use async and await. Avoid then chains.
- Error handling:
  - Fail loudly in development.
  - Provide helpful user feedback in production.

## Gamification rules (v1)

When adding or changing gamification logic, try to follow these rules:

- Award XP for:
  - Completing tasks
  - Hitting streak milestones
  - Reaching application milestones for each college
- Do not remove XP for missing a day.
- Streaks reset if there is a day with zero completed tasks.
- Levels are based on total XP with a simple curve that gets slightly steeper over time.

Feel free to implement the specific formulas as long as they are easy to adjust in one place.

## How to work with this project as Claude

When generating or editing code:

1. Prefer small, focused pull request sized changes.
2. When possible, show file by file diffs or only the changed sections, not entire huge files.
3. Respect the existing patterns, types, and folder structure.
4. If something in the stack is ambiguous, choose a reasonable default and mention your assumption in comments at the top of the file.
5. Prefer clarity over cleverness. Future human maintainers should be able to read the code quickly.

If asked to design new features, start with:

- A short explanation of the approach
- Any required data model changes
- The main components or modules you will create

Then show the code.
