// src/lib/route-protection.ts

import { type User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

import { createAuthRepository, createAuthService } from '@/core/domains/auth'
import { db } from '@/db'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

import { APP_ROUTES, ROLES, ROUTE_PROTECTION, type UserRole } from './constants'

const logger = createLogger('RouteProtection')

/**
 * Tipuri pentru protecția rutelor
 */
export type RouteProtectionResult = {
  isAuthorized: boolean
  user: User | null
  role: UserRole
  redirectTo?: string
}

/**
 * Verifică dacă o cale este publică (nu necesită autentificare)
 */
export function isPublicRoute(pathname: string): boolean {
  return ROUTE_PROTECTION.PUBLIC_ROUTES.some((route) => {
    if (route === '/') return pathname === route
    return pathname.startsWith(route)
  })
}

/**
 * Verifică dacă o cale necesită rol de admin
 */
export function requiresAdminRole(pathname: string): boolean {
  return ROUTE_PROTECTION.ADMIN_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * Verifică dacă o cale necesită rol de stylist
 */
export function requiresStylistRole(pathname: string): boolean {
  return ROUTE_PROTECTION.STYLIST_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * Obține utilizatorul autentificat și rolul său
 */
export async function getCurrentUserWithRole(): Promise<{ user: User | null; role: UserRole }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { user: null, role: null }
    }

    const authRepository = createAuthRepository(db)
    const authService = createAuthService(authRepository, supabase)
    const role = await authService.ensureUserRole(user)

    return { user, role }
  } catch (error) {
    logger.error('Failed to get current user with role', { error })
    return { user: null, role: null }
  }
}

/**
 * Verifică accesul pentru o rută specifică
 * Returnează informații despre autorizare fără a face redirect
 */
export async function checkRouteAccess(pathname: string): Promise<RouteProtectionResult> {
  const { user, role } = await getCurrentUserWithRole()

  // Rutele publice sunt accesibile tuturor
  if (isPublicRoute(pathname)) {
    return { isAuthorized: true, user, role }
  }

  // Utilizatorii neautentificați trebuie redirectionați la login
  if (!user) {
    return {
      isAuthorized: false,
      user: null,
      role: null,
      redirectTo: APP_ROUTES.LOGIN,
    }
  }

  // Utilizatorii autentificați fără rol nu pot accesa rute protejate
  if (!role) {
    logger.warn('Authenticated user without role attempted to access protected route', {
      userId: user.id,
      pathname,
    })
    return {
      isAuthorized: false,
      user,
      role: null,
      redirectTo: APP_ROUTES.LOGIN,
    }
  }

  // Verificare pentru rute de admin
  if (requiresAdminRole(pathname)) {
    const isAuthorized = role === ROLES.ADMIN
    return {
      isAuthorized,
      user,
      role,
      redirectTo: isAuthorized ? undefined : APP_ROUTES.LOGIN,
    }
  }

  // Verificare pentru rute de stylist
  if (requiresStylistRole(pathname)) {
    const isAuthorized = role === ROLES.STYLIST
    return {
      isAuthorized,
      user,
      role,
      redirectTo: isAuthorized ? undefined : APP_ROUTES.LOGIN,
    }
  }

  // Pentru alte rute, utilizatorii autentificați cu rol sunt autorizați
  return { isAuthorized: true, user, role }
}

/**
 * Verifică accesul pentru o rută și face redirect dacă este necesar
 * Această funcție trebuie apelată în Server Components
 */
export async function enforceRouteAccess(pathname: string): Promise<{ user: User; role: UserRole }> {
  const result = await checkRouteAccess(pathname)

  if (!result.isAuthorized && result.redirectTo) {
    logger.info('Redirecting unauthorized user', {
      pathname,
      userId: result.user?.id,
      role: result.role,
      redirectTo: result.redirectTo,
    })
    redirect(result.redirectTo)
  }

  if (!result.user || !result.role) {
    // Acest caz nu ar trebui să se întâmple dacă logica de mai sus este corectă
    logger.error('Unexpected state: authorized but no user or role', { pathname })
    redirect(APP_ROUTES.LOGIN)
  }

  return { user: result.user, role: result.role }
}

/**
 * Verifică dacă utilizatorul curent este admin
 * Funcție helper pentru Server Actions
 */
export async function ensureUserIsAdmin(): Promise<User> {
  const { user, role } = await getCurrentUserWithRole()

  if (!user) {
    logger.warn('Unauthenticated user attempted admin action')
    throw new Error(ROUTE_PROTECTION.MESSAGES.UNAUTHORIZED)
  }

  if (role !== ROLES.ADMIN) {
    logger.warn('Non-admin user attempted admin action', { userId: user.id, role })
    throw new Error(ROUTE_PROTECTION.MESSAGES.FORBIDDEN_ADMIN)
  }

  return user
}

/**
 * Verifică dacă utilizatorul curent este stylist
 * Funcție helper pentru Server Actions
 */
export async function ensureUserIsStylist(): Promise<User> {
  const { user, role } = await getCurrentUserWithRole()

  if (!user) {
    logger.warn('Unauthenticated user attempted stylist action')
    throw new Error(ROUTE_PROTECTION.MESSAGES.UNAUTHORIZED)
  }

  if (role !== ROLES.STYLIST) {
    logger.warn('Non-stylist user attempted stylist action', { userId: user.id, role })
    throw new Error(ROUTE_PROTECTION.MESSAGES.FORBIDDEN_STYLIST)
  }

  return user
}
