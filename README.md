# 🎒 Hiking Gear Weight Planner

A modern, intuitive web application for planning and analyzing hiking gear weight distribution. Built with SvelteKit and TypeScript, this tool helps hikers optimize their pack weight by tracking gear items and visualizing weight distribution across categories.

![Gear Planner Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Hiking+Gear+Weight+Planner)

## ✨ Features

- **📝 Easy Gear Entry** - Add hiking items with name, category, and weight in grams
- **⚖️ Automatic Calculations** - Real-time total weight calculation with smart formatting (g/kg)
- **📊 Category Analysis** - Visual breakdown of weight distribution by gear category
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI** - Beautiful gradient design with smooth animations and interactions
- **⚡ Real-time Updates** - Instant recalculation as you add or remove items

## 🏕️ Gear Categories

The planner organizes gear into 5 logical categories:

- **🧥 Clothing & Protection** - Base layers, rain gear, insulation, gloves, hats
- **💧 Hydration & Essentials** - Water, filters, first aid, navigation, tools
- **🏕️ Shelter** - Tent, tarp, footprint, stakes
- **😴 Sleep System** - Sleeping bag, pad, pillow
- **🎒 Pack System** - Backpack, stuff sacks, compression sacks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed on your system
- npm, pnpm, or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gear-plan.git
   cd gear-plan
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173) to start planning your gear!

## 📖 Usage

### Adding Gear Items

1. Enter the item name (e.g., "Ultralight Tent")
2. Select the appropriate category from the dropdown
3. Enter the weight in grams
4. Click "Add Item" or press Enter

### Viewing Analysis

- **Total Weight** is displayed prominently at the top
- **Category Breakdown** shows weight and percentage for each category
- **Progress Bars** provide visual representation of weight distribution
- **Individual Items** are listed with category tags and weights

### Managing Items

- Click the **×** button on any item to remove it
- Items are automatically sorted by category for easy viewing
- All calculations update instantly when items are added or removed

## 🛠️ Development

### Project Structure

```
gear-plan/
├── src/
│   ├── lib/
│   │   ├── types.ts          # TypeScript interfaces and types
│   │   └── utils.ts          # Calculation and utility functions
│   ├── routes/
│   │   ├── +layout.svelte    # App layout and global styles
│   │   └── +page.svelte      # Main gear planner component
│   └── app.css               # Global CSS styles
├── static/                   # Static assets
├── package.json
└── README.md
```

### Key Technologies

- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack web framework
- **[Svelte 5](https://svelte.dev/)** - Latest version with runes syntax
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server

### Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run check
npm run check:watch

# Production build
npm run build

# Preview production build
npm run preview
```

## 🎯 Future Enhancements

- [ ] **Data Persistence** - Save gear lists locally or to a database
- [ ] **Multiple Trip Plans** - Create and manage different gear configurations
- [ ] **Gear Templates** - Pre-built gear lists for different trip types
- [ ] **Weight Goals** - Set target weights and track progress
- [ ] **Export/Import** - Share gear lists or backup data
- [ ] **Gear Database** - Community-driven gear weight database
- [ ] **Weight Tracking** - Historical analysis of pack weights over time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the ultralight hiking community
- Built with the amazing Svelte ecosystem
- Icons and design inspiration from modern web applications

---

**Happy hiking! 🥾⛰️**

*Made with ❤️ for the hiking community*
