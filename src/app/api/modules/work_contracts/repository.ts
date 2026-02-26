import { prisma } from '@/lib/database/prisma'
import type { WorkContract } from '@prisma/client'

export class WorkContractsRepository {
  async findAll(): Promise<WorkContract[]> {
    return prisma.workContract.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<WorkContract | null> {
    return prisma.workContract.findUnique({
      where: { id },
    })
  }

  async create(data: {
    title: string
    description: string
    location: string
    salary: number
    type: string
    requirements: string
  }): Promise<WorkContract> {
    return prisma.workContract.create({
      data,
    })
  }

  async update(id: string, data: Partial<{
    title: string
    description: string
    location: string
    salary: number
    type: string
    requirements: string
    isActive: boolean
  }>): Promise<WorkContract> {
    return prisma.workContract.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<WorkContract> {
    return prisma.workContract.update({
      where: { id },
      data: { isActive: false },
    })
  }
}