'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/AuthProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'editor' | 'author'
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/login',
  fallback 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not authenticated, redirect to login
        const currentPath = window.location.pathname
        const loginUrl = new URL(redirectTo, window.location.origin)
        loginUrl.searchParams.set('redirectTo', currentPath)
        router.push(loginUrl.toString() as any)
        return
      }

      if (requiredRole && profile) {
        // Check role hierarchy: admin > editor > author
        const roleHierarchy = { admin: 3, editor: 2, author: 1 }
        const userRoleLevel = roleHierarchy[profile.role] || 0
        const requiredRoleLevel = roleHierarchy[requiredRole] || 0

        if (userRoleLevel < requiredRoleLevel) {
          // User doesn't have required role
          router.push('/dashboard/unauthorized')
          return
        }
      }
    }
  }, [user, profile, loading, requiredRole, redirectTo, router])

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (requiredRole && profile) {
    const roleHierarchy = { admin: 3, editor: 2, author: 1 }
    const userRoleLevel = roleHierarchy[profile.role] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0

    if (userRoleLevel < requiredRoleLevel) {
      return null // Will redirect in useEffect
    }
  }

  return <>{children}</>
}