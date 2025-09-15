import React from 'react'
import { render, screen } from '@testing-library/react'
import { Layout } from '../Layout'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Layout Components', () => {
  describe('Layout.Root', () => {
    it('renders children with proper structure', () => {
      render(
        <Layout.Root>
          <div data-testid="test-content">Test Content</div>
        </Layout.Root>
      )

      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <Layout.Root className="custom-class">
          <div>Test</div>
        </Layout.Root>
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('Layout.Asymmetric', () => {
    it('renders children with grid layout', () => {
      render(
        <Layout.Asymmetric>
          <div data-testid="asymmetric-content">Asymmetric Content</div>
        </Layout.Asymmetric>
      )

      expect(screen.getByTestId('asymmetric-content')).toBeInTheDocument()
    })

    it('applies grid classes', () => {
      const { container } = render(
        <Layout.Asymmetric>
          <div>Test</div>
        </Layout.Asymmetric>
      )

      expect(container.firstChild).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-12')
    })
  })
})