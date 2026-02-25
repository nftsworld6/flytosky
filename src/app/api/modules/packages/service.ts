import { PackagesRepository } from './repository'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { CreatePackageInput, UpdatePackageInput } from './types'

export class PackagesService {
  private repository = new PackagesRepository()

  async getAllPackages() {
    const packages = await this.repository.findAll()
    return packages.map(pkg => ({
      ...pkg,
      finalPrice: calculateFinalPrice({ basePrice: pkg.basePrice }),
    }))
  }

  async getPackageById(id: string) {
    const pkg = await this.repository.findById(id)
    if (!pkg) {
      throw new Error('Package not found')
    }
    return {
      ...pkg,
      finalPrice: calculateFinalPrice({ basePrice: pkg.basePrice }),
    }
  }

  async createPackage(input: CreatePackageInput) {
    return this.repository.create(input)
  }

  async updatePackage(id: string, input: UpdatePackageInput) {
    return this.repository.update(id, input)
  }

  async deletePackage(id: string) {
    return this.repository.delete(id)
  }
}