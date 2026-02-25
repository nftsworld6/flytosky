import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/affiliate')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'AFFILIATE') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/affiliate/:path*'],
}