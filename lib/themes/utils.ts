import { ThemeData } from './types'

/**
 * Converts HSL color string to CSS custom property format
 * Example: "hsl(222.2, 47.4%, 11.2%)" -> "222.2 47.4% 11.2%"
 */
export function hslToCssVar(hslString: string): string {
  const match = hslString.match(/hsl\(([^)]+)\)/)
  if (!match) return hslString
  return match[1]
}

/**
 * Applies theme data to CSS custom properties
 */
export function applyThemeToDocument(themeData: ThemeData): void {
  const root = document.documentElement
  
  // Apply color variables
  Object.entries(themeData.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, hslToCssVar(value))
  })
  
  // Apply font variables
  Object.entries(themeData.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value)
  })
  
  // Apply spacing variables
  root.style.setProperty('--spacing-scale', themeData.spacing.scale.toString())
  root.style.setProperty('--spacing-rhythm', themeData.spacing.rhythm.toString())
}

/**
 * Generates CSS custom properties string from theme data
 */
export function generateCSSVariables(themeData: ThemeData): string {
  const colorVars = Object.entries(themeData.colors)
    .map(([key, value]) => `  --${key}: ${hslToCssVar(value)};`)
    .join('\n')
  
  const fontVars = Object.entries(themeData.fonts)
    .map(([key, value]) => `  --font-${key}: ${value};`)
    .join('\n')
  
  const spacingVars = [
    `  --spacing-scale: ${themeData.spacing.scale};`,
    `  --spacing-rhythm: ${themeData.spacing.rhythm};`,
  ].join('\n')
  
  return `:root {\n${colorVars}\n${fontVars}\n${spacingVars}\n}`
}

/**
 * Creates a theme preview by temporarily applying theme variables
 */
export function previewTheme(themeData: ThemeData, element?: HTMLElement): () => void {
  const targetElement = element || document.documentElement
  const originalStyles = new Map<string, string>()
  
  // Store original values
  const allProperties = [
    ...Object.keys(themeData.colors).map(key => `--${key}`),
    ...Object.keys(themeData.fonts).map(key => `--font-${key}`),
    '--spacing-scale',
    '--spacing-rhythm',
  ]
  
  allProperties.forEach(prop => {
    const currentValue = targetElement.style.getPropertyValue(prop)
    originalStyles.set(prop, currentValue)
  })
  
  // Apply new theme
  applyThemeToDocument(themeData)
  
  // Return cleanup function
  return () => {
    originalStyles.forEach((value, prop) => {
      if (value) {
        targetElement.style.setProperty(prop, value)
      } else {
        targetElement.style.removeProperty(prop)
      }
    })
  }
}

/**
 * Validates if a color string is a valid HSL format
 */
export function isValidHSLColor(color: string): boolean {
  const hslRegex = /^hsl\(\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?%\s*,\s*\d+(\.\d+)?%\s*\)$/
  return hslRegex.test(color)
}

/**
 * Converts RGB to HSL format for theme compatibility
 */
export function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

/**
 * Generates a slug from theme name
 */
export function generateThemeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}