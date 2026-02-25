import { prisma } from '@/lib/database/prisma'
import type { User } from '@prisma/client'

export class UsersRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async update(id: string, data: Partial<{
    name: string
    email: string
  }>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    })
  }
}