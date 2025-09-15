import { z } from 'zod'

// Theme data structure based on design document
export const ThemeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  surface: z.string(),
  text: z.string(),
  muted: z.string(),
  border: z.string(),
})

export const ThemeFontsSchema = z.object({
  heading: z.string(),
  body: z.string(),
  mono: z.string(),
})

export const ThemeSpacingSchema = z.object({
  scale: z.number().min(0.5).max(2),
  rhythm: z.number().min(0.5).max(2),
})

export const ThemeDataSchema = z.object({
  colors: ThemeColorsSchema,
  fonts: ThemeFontsSchema,
  spacing: ThemeSpacingSchema,
})

export const ThemeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  data: ThemeDataSchema,
  is_public: z.boolean(),
  created_by: z.string(),
  created_at: z.string(),
})

// Type exports
export type ThemeColors = z.infer<typeof ThemeColorsSchema>
export type ThemeFonts = z.infer<typeof ThemeFontsSchema>
export type ThemeSpacing = z.infer<typeof ThemeSpacingSchema>
export type ThemeData = z.infer<typeof ThemeDataSchema>
export type Theme = z.infer<typeof ThemeSchema>

// Default theme data
export const DEFAULT_THEME: ThemeData = {
  colors: {
    primary: 'hsl(222.2, 47.4%, 11.2%)',
    secondary: 'hsl(210, 40%, 96%)',
    accent: 'hsl(210, 40%, 96%)',
    background: 'hsl(0, 0%, 100%)',
    surface: 'hsl(0, 0%, 100%)',
    text: 'hsl(222.2, 84%, 4.9%)',
    muted: 'hsl(215.4, 16.3%, 46.9%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  spacing: {
    scale: 1,
    rhythm: 1.5,
  },
}

// Built-in themes
export const BUILT_IN_THEMES: Omit<Theme, 'created_by' | 'created_at'>[] = [
  {
    id: 'default',
    slug: 'default',
    name: 'Default Light',
    data: DEFAULT_THEME,
    is_public: true,
  },
  {
    id: 'dark',
    slug: 'dark',
    name: 'Dark Mode',
    data: {
      colors: {
        primary: 'hsl(210, 40%, 98%)',
        secondary: 'hsl(217.2, 32.6%, 17.5%)',
        accent: 'hsl(217.2, 32.6%, 17.5%)',
        background: 'hsl(222.2, 84%, 4.9%)',
        surface: 'hsl(222.2, 84%, 4.9%)',
        text: 'hsl(210, 40%, 98%)',
        muted: 'hsl(215, 20.2%, 65.1%)',
        border: 'hsl(217.2, 32.6%, 17.5%)',
      },
      fonts: DEFAULT_THEME.fonts,
      spacing: DEFAULT_THEME.spacing,
    },
    is_public: true,
  },
  {
    id: 'magazine',
    slug: 'magazine',
    name: 'Magazine Style',
    data: {
      colors: {
        primary: 'hsl(0, 0%, 9%)',
        secondary: 'hsl(47, 100%, 95%)',
        accent: 'hsl(25, 95%, 53%)',
        background: 'hsl(0, 0%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        text: 'hsl(0, 0%, 9%)',
        muted: 'hsl(0, 0%, 45%)',
        border: 'hsl(0, 0%, 89%)',
      },
      fonts: {
        heading: 'Playfair Display, Georgia, serif',
        body: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, Consolas, monospace',
      },
      spacing: {
        scale: 1.2,
        rhythm: 1.6,
      },
    },
    is_public: true,
  },
]