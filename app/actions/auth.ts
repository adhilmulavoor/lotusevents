'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Normalize role aliases so DB roles (WORKER, CONTROLLER, etc.) 
// match what the login page sends (member, controller, etc.)
function normalizeRole(role: string): string {
  const map: Record<string, string> = {
    // DB → canonical
    WORKER: 'member',
    MEMBER: 'member',
    CONTROLLER: 'controller',
    ACCOUNTANT: 'accountant',
    ADMIN: 'admin',
    // login page → canonical (already lowercase, just keep them)
    worker: 'member',
    member: 'member',
    controller: 'controller',
    accountant: 'accountant',
    admin: 'admin',
  }
  return map[role] ?? role.toLowerCase()
}

export async function loginAction(prevState: any, formData: FormData) {
  const emailOrPhone = formData.get('emailOrPhone') as string
  const password = formData.get('password') as string
  const requestedRole = formData.get('role') as string || 'member'

  if (!emailOrPhone || !password) {
    return { error: 'Email/Phone and password are required.' }
  }

  // Find user by phone OR email (admin client bypasses RLS)
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .or(`phone.eq.${emailOrPhone},email.eq.${emailOrPhone}`)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return { error: 'Invalid credentials. User not found.' }
    }
    return { error: `Database error: ${error.message}` }
  }

  if (!user) {
    return { error: 'Invalid credentials.' }
  }

  // Normalize both sides so WORKER == member, CONTROLLER == controller, etc.
  const userRoleNorm = normalizeRole(user.role)
  const requestedRoleNorm = normalizeRole(requestedRole)

  // Admins can access any portal
  if (userRoleNorm !== requestedRoleNorm && userRoleNorm !== 'admin') {
    return { error: `You do not have permission to access the ${requestedRole} portal.` }
  }

  // Verify password — supports bcrypt hash or plain text (prototyping)
  const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
  const isValid = isBcrypt
    ? await verifyPassword(password, user.password)
    : password === user.password

  if (!isValid) {
    return { error: 'Invalid credentials.' }
  }

  // Sign JWT
  const token = await signToken({
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,   // keep original DB role in token (middleware uses it)
  })

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Map normalized requested role → route prefix
  const routeMap: Record<string, string> = {
    member: 'worker',
    controller: 'controller',
    accountant: 'accountant',
    admin: 'admin',
  }
  const routePrefix = routeMap[requestedRoleNorm] ?? routeMap[userRoleNorm] ?? 'worker'
  redirect(`/${routePrefix}/dashboard`)
}

