'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  mobile?: boolean
  onItemClick?: () => void
}

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export const Navigation: React.FC<NavigationProps> = ({ mobile = false, onItemClick }) => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const baseClasses = mobile
    ? 'block px-3 py-2 text-base font-medium rounded-md transition-colors'
    : 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'

  const activeClasses = 'text-primary bg-accent'
  const inactiveClasses = 'text-foreground hover:text-primary hover:bg-accent'

  return (
    <nav className={mobile ? 'space-y-1' : 'flex space-x-1'} role="navigation">
      {navigationItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`${baseClasses} ${
            isActive(item.href) ? activeClasses : inactiveClasses
          }`}
          onClick={onItemClick}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}