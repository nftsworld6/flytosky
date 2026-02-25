import { hashPassword, verifyPassword } from '@/lib/auth/bcrypt'
import { generateToken } from '@/lib/auth/jwt'
import { AuthRepository } from './repository'
import type { LoginInput, RegisterInput } from './types'
import { randomBytes } from 'crypto'

export class AuthService {
  private repository = new AuthRepository()

  async login(input: LoginInput) {
    const user = await this.repository.findUserByEmail(input.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await verifyPassword(input.password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  async register(input: RegisterInput) {
    const existingUser = await this.repository.findUserByEmail(input.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await hashPassword(input.password)
    const affiliateCode = input.role === 'AFFILIATE' ? randomBytes(8).toString('hex') : undefined

    const user = await this.repository.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role || 'USER',
      affiliateCode,
    })

    const token = generateToken({
      userId: user.id,
      role: user.role,
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        affiliateCode: user.affiliateCode,
      },
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.repository.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      affiliateCode: user.affiliateCode,
    }
  }
}