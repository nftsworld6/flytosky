import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from './service'
import { loginSchema, registerSchema } from './types'

const authService = new AuthService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'login') {
      const input = loginSchema.parse(body)
      const result = await authService.login(input)
      return NextResponse.json(result)
    }

    if (action === 'register') {
      const input = registerSchema.parse(body)
      const result = await authService.register(input)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token and get user - this would need JWT verification
    // For now, return mock
    return NextResponse.json({ user: { id: '1', name: 'User' } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}