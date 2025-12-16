# 🚀 Business Operations Framework

> Business Operations Platform for Modern Teams

## ✨ Features

- 🎨 **Modern UI Components** - Comprehensive component library for business operations
- 🌙 **Dark Mode** - Built-in dark mode support with smooth transitions
- 🌍 **Multi-Language** - International support (English & French included)
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Fast & Optimized** - Lightning-fast performance for productivity
- 🧩 **Modular Components** - Reusable, composable, and customizable components
- 📦 **Clean Architecture** - Organized structure for easy maintenance and scalability

## 📦 What's Included

### UI Components
- ✅ **BfButton** - Multiple variants (primary, secondary, outline, ghost) and sizes
- ✅ **BfModal** - Accessible modal dialogs with size variants
- ✅ **BfTabs** - Tab navigation with icon support
- ✅ **BfTooltip** - Contextual tooltips with flexible positioning
- ✅ **BfCard** - Versatile card component with multiple variants
- ✅ **BfBadge** - Status badges with color variants
- ✅ **BfPricingCard** - Pricing cards with feature lists
- ✅ **BfWaitlistForm** - Email collection form with validation
- ✅ **BfThemeToggle** - Dark/light mode switcher
- ✅ **BfNavigation** - Responsive navigation bar

### Pages
- 🏠 **Home** - Landing page showcasing platform capabilities
- 📋 **Components** - Interactive component library
- 💰 **Pricing** - Flexible pricing options
- 📧 **Contact Form** - Professional contact forms with validation

### API Routes
- 📨 **POST /api/waitlist** - Waitlist signup endpoint with validation

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18+
- npm, pnpm, or bun

### Installation

```bash
# 1. Clone or extract the framework
cd nuxt-business-operations-framework

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Your platform will be available at `http://localhost:3000` 🎉

### Quick Customization

#### 1. Update Brand Name
Edit `theme-config.ts`:
```typescript
export const themeConfig = {
  brand: {
    name: "Your Business Platform",  // Change this
    tagline: "Your tagline",  // Change this
  },
}
```

#### 2. Customize Colors
Edit `app/assets/css/main.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Your primary color */
}
```

#### 3. Update Navigation
Edit `theme-config.ts`:
```typescript
navigation: {
  links: [
    { to: "/", label: "nav.home" },
    { to: "/dashboard", label: "nav.dashboard" },  // Add your pages
  ],
}
```

## 📁 Project Structure

```
business-operations-framework/
├── app/
│   ├── assets/css/          # Global styles
│   ├── layouts/             # Layout components
│   └── pages/               # Application pages
├── layers/
│   ├── ui-kit/              # UI components layer
│   └── components/          # Reusable UI components
├── i18n/locales/            # Translation files
├── server/api/              # API routes
├── theme-config.ts          # Theme configuration
└── nuxt.config.ts           # Nuxt configuration
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview production build

# Testing
npm run test:e2e             # Run E2E tests
```

## 📄 License

Commercial license - see LICENSE file for details.

---

Made with ❤️
