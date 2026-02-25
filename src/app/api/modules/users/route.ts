import { NextResponse } from 'next/server'
import { UsersService } from './service'

const usersService = new UsersService()

export async function GET() {
  try {
    const users = await usersService.getAllUsers()
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}