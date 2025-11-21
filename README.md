# Col-Legit

A gamified college application tracker that helps students manage their college applications with XP, streaks, and achievements.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (Auth, Database, Storage)
- **Dev Tools**: ESLint, Prettier, TypeScript strict mode

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (install with `npm install -g pnpm` or `corepack enable`)
- A Supabase project (create one at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (app)/             # Authenticated app routes
│   ├── (marketing)/       # Public marketing pages
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── features/          # Feature-specific components
│   ├── providers/         # React context providers
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── supabase/          # Supabase client utilities
│   ├── db/                # Database access functions
│   └── gamification/      # XP, streaks, achievements
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Code Standards

- TypeScript strict mode is enabled
- All code must pass ESLint and Prettier checks
- Use async/await instead of promise chains
- Follow the patterns established in CLAUDE.md

## Database Setup

See `CLAUDE.md` for the complete data model. You'll need to create tables in Supabase for:

- profiles
- colleges
- user_colleges
- tasks
- gamification_state
- achievements
- user_achievements

## Contributing

Please read `CLAUDE.md` for detailed guidelines on:

- Architecture patterns
- Coding standards
- Gamification rules
- UX principles

## License

MIT
