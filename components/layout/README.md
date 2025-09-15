# Layout Components

This directory contains the core layout and navigation components for the multilingual portfolio application.

## Components

### Layout.Root
The main layout wrapper that provides the basic page structure with header, main content area, and footer.

```tsx
import { Layout } from '@/components/layout'

export default function Page() {
  return (
    <Layout.Root>
      <div>Your page content</div>
    </Layout.Root>
  )
}
```

**Features:**
- Responsive design with mobile-first approach
- Semantic HTML structure with proper ARIA roles
- Sticky header with backdrop blur effect
- Flexible main content area
- Consistent footer across all pages

### Layout.Asymmetric
A specialized layout component for magazine-style, asymmetric grid layouts.

```tsx
import { Layout } from '@/components/layout'

export default function MagazinePage() {
  return (
    <Layout.Asymmetric>
      <div className="lg:col-span-8">Main content</div>
      <div className="lg:col-span-4">Sidebar</div>
    </Layout.Asymmetric>
  )
}
```

**Features:**
- 12-column CSS Grid system on large screens
- Single column on mobile devices
- Flexible column spanning for creative layouts
- Responsive gap spacing

### Header
The main site header with navigation and branding.

**Features:**
- Responsive navigation with mobile hamburger menu
- Sticky positioning with backdrop blur
- Active page highlighting
- Accessible keyboard navigation
- ARIA labels and proper focus management

### Navigation
Reusable navigation component used in both desktop and mobile contexts.

**Features:**
- Active route detection
- Mobile-responsive design
- Keyboard accessible
- Customizable styling for different contexts

### Footer
Site footer with links and social media icons.

**Features:**
- Multi-column responsive layout
- Quick navigation links
- Social media integration
- Copyright information

### Breadcrumb
Breadcrumb navigation component for dashboard sections.

```tsx
import { Breadcrumb } from '@/components/layout'

// Auto-generated from current path
<Breadcrumb />

// Custom breadcrumb items
<Breadcrumb items={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Edit Project' }
]} />
```

**Features:**
- Auto-generation from current pathname
- Custom breadcrumb items support
- Accessible navigation with proper ARIA labels
- Responsive design

## Accessibility Features

All layout components follow WCAG 2.1 AA guidelines:

- **Semantic HTML**: Proper use of header, main, nav, and footer elements
- **Keyboard Navigation**: Full keyboard accessibility with proper tab order
- **Screen Reader Support**: ARIA labels, roles, and descriptions
- **Focus Management**: Visible focus indicators and logical focus flow
- **Color Contrast**: Meets minimum contrast requirements

## Responsive Design

The layout system uses a mobile-first approach with Tailwind CSS:

- **Mobile (default)**: Single column, stacked navigation
- **Tablet (md: 768px+)**: Multi-column layouts, horizontal navigation
- **Desktop (lg: 1024px+)**: Full asymmetric grid capabilities

## Usage Examples

### Basic Page Layout
```tsx
import { Layout } from '@/components/layout'

export default function AboutPage() {
  return (
    <Layout.Root>
      <div className="container mx-auto px-4 py-8">
        <h1>About Me</h1>
        <p>Page content...</p>
      </div>
    </Layout.Root>
  )
}
```

### Magazine-Style Layout
```tsx
import { Layout } from '@/components/layout'

export default function ProjectPage() {
  return (
    <Layout.Root>
      <Layout.Asymmetric className="container mx-auto px-4 py-8">
        <div className="lg:col-span-8 lg:col-start-1">
          <h1>Featured Project</h1>
          <p>Main project description...</p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <aside>
            <h3>Project Details</h3>
            <ul>Project metadata...</ul>
          </aside>
        </div>
      </Layout.Asymmetric>
    </Layout.Root>
  )
}
```

### Dashboard with Breadcrumbs
```tsx
import { Layout, Breadcrumb } from '@/components/layout'

export default function DashboardPage() {
  return (
    <Layout.Root>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        <h1>Dashboard</h1>
        <p>Dashboard content...</p>
      </div>
    </Layout.Root>
  )
}
```

## Testing

The layout components include comprehensive tests covering:
- Component rendering
- Responsive behavior
- Accessibility features
- Navigation functionality

Run tests with:
```bash
npm test components/layout
```

## Future Enhancements

- Theme switching integration
- Language switching integration
- Animation and transition effects
- Advanced grid layout patterns
- Performance optimizations