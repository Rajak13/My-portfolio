import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutRootProps {
  children: React.ReactNode
  className?: string
}

interface LayoutAsymmetricProps {
  children: React.ReactNode
  className?: string
}

// Root layout component with header, main, and footer
const Root: React.FC<LayoutRootProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header />
      <main className="flex-1" role="main">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// Asymmetric layout for magazine-style layouts
const Asymmetric: React.FC<LayoutAsymmetricProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  )
}

// Export as compound component
export const Layout = {
  Root,
  Asymmetric,
}