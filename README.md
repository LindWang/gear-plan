# Hiking Gear Weight Planner

A web application for planning and analyzing hiking gear weight distribution. Built with SvelteKit and TypeScript, this tool helps hikers optimize their pack weight by tracking gear items and visualizing weight distribution across categories.

## Features

- **Easy Gear Entry** - Add hiking items with name, category, and weight in grams
- **Automatic Calculations** - Real-time total weight calculation with smart formatting (g/kg)
- **Category Analysis** - Visual breakdown of weight distribution by gear category
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Clean design with smooth animations and interactions
- **Real-time Updates** - Instant recalculation as you add or remove items

## Gear Categories

The planner organizes gear into 5 logical categories:

- **Clothing & Protection** - Base layers, rain gear, insulation, gloves, hats
- **Hydration & Essentials** - Water, filters, first aid, navigation, tools
- **Shelter** - Tent, tarp, footprint, stakes
- **Sleep System** - Sleeping bag, pad, pillow
- **Pack System** - Backpack, stuff sacks, compression sacks

## Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/PeterZhouDev/gear-plan.git
cd gear-plan
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

**Adding Items:** Enter item name, select category, input weight in grams, then click "Add Item" or press Enter.

**Analysis:** View total weight and category breakdown with percentage distribution and progress bars.

**Management:** Remove items with the × button. All calculations update automatically.

## Development

### Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [Svelte 5](https://svelte.dev/) - Component framework with runes syntax
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool and dev server

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run check    # Type checking
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.
