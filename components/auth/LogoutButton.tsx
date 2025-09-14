'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/providers/AuthProvider'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
  onLogout?: () => void
}

export function LogoutButton({ 
  className = "text-red-600 hover:text-red-800", 
  children,
  onLogout 
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signOut } = useAuth()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      if (onLogout) {
        onLogout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? 'Signing out...' : (children || 'Sign out')}
    </button>
  )
}