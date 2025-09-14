# Multilingual Portfolio

A modern, interactive portfolio website with multi-theme support and full content management capabilities. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🌍 **Multi-language support** (English & Nepali)
- 🎨 **Dynamic theme system** with live preview
- 📝 **Content Management System** for projects and blog posts
- 🖼️ **Media management** with automatic optimization
- 🔐 **Secure authentication** with Supabase Auth
- ⚡ **High performance** with SSG/ISR
- ♿ **Accessibility compliant** (WCAG 2.1 AA)
- 📱 **Responsive design** with magazine-style layouts

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS with custom design tokens
- **Animations:** Framer Motion

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multilingual-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                 # Next.js 14 App Router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   ├── content/        # Content-specific components
│   └── ...
├── lib/                # Utilities and configurations
│   ├── supabase/       # Supabase client and utilities
│   ├── utils/          # General utilities
│   └── ...
├── styles/             # Additional CSS files
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT License - see LICENSE file for details.