import { prisma } from '@/lib/database/prisma'
import type { User } from '@prisma/client'

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async createUser(data: {
    name: string
    email: string
    password: string
    role?: 'ADMIN' | 'USER' | 'AFFILIATE'
    affiliateCode?: string
  }): Promise<User> {
    return prisma.user.create({
      data,
    })
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }
}