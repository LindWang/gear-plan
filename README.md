# Gear Planner

Modern web app for planning and analyzing hiking gear with weight tracking and organization. Built with SvelteKit, TypeScript, and Neon PostgreSQL.

## Features

- Multiple gear lists for different trips
- Add items with name, category, weight, and description
- Real-time weight totals and statistics
- Category breakdown and analytics
- Toast notifications and confirmation dialogs
- Responsive, accessible design
- Neon PostgreSQL cloud database

## Gear Categories

Five main categories:

- Clothing & Protection
- Hydration & Essentials
- Shelter
- Sleep System
- Pack System

## Quick Start

**Prerequisites:** Node.js 18+, npm/pnpm/yarn, Neon PostgreSQL account

**Install:**

```bash
git clone https://github.com/PeterZhouDev/gear-plan.git
cd gear-plan
npm install
```

**Environment:**

1. Create Neon PostgreSQL account
2. Copy `.env.example` to `.env.local`
3. Add your Neon database URL to `.env.local`

**Database:**
Run schema from `neon-schema.sql` in Neon SQL Editor

**Start Development:**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Usage

- Create gear lists for different trips
- Add, edit, and delete gear items
- View weight summary and gear statistics
- Responsive UI with feedback and confirmation dialogs

## Architecture

Feature-Sliced Design (FSD):

src/

- app/: stores, styles
- entities/: gear, gear-list
- pages/: main-page
- routes/: SvelteKit routing
- shared/: api, lib, ui
- widgets/: gear-form, gear-list, gear-stats, weight-summary

## Development

**Tech Stack:**

- SvelteKit
- Svelte 5
- TypeScript
- Neon PostgreSQL
- Vite

**Scripts:**

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npm run check    # Type check
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Follow FSD architecture
4. Use TypeScript
5. Test on multiple devices
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE)

---
