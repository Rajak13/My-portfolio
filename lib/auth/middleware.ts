import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function createAuthMiddleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createServerClient()

    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Auth middleware error:', error)
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')
    const isPublicPage = ['/', '/projects', '/blog', '/about'].some(path => 
      request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
    )

    // Handle API routes separately
    if (isApiRoute) {
      return response
    }

    // Allow access to public pages
    if (isPublicPage) {
      return response
    }

    // If user is not authenticated and trying to access dashboard
    if (!session && isDashboardPage) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is authenticated and trying to access auth pages (except callback and error pages)
    if (session && isAuthPage && 
        !request.nextUrl.pathname.includes('/callback') && 
        !request.nextUrl.pathname.includes('/auth-code-error')) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    return response
  } catch (error) {
    console.error('Unexpected error in auth middleware:', error)
    return NextResponse.next()
  }
}

export async function requireAuth(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return null // Continue with the request
  } catch (error) {
    console.error('Error in requireAuth:', error)
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Get user profile to check role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id as any)
      .single()

    if (error) {
      console.error('Error fetching user profile for role check:', error)
      return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
    }

    if (!profile || !allowedRoles.includes((profile as any).role)) {
      return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
    }

    return null // Continue with the request
  } catch (error) {
    console.error('Error in requireRole:', error)
    return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url))
  }
}