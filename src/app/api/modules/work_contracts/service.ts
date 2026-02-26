import { WorkContractsRepository } from './repository'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { CreateWorkContractInput, UpdateWorkContractInput } from './types'

export class WorkContractsService {
  private repository = new WorkContractsRepository()

  async getAllWorkContracts() {
    const workContracts = await this.repository.findAll()
    return workContracts.map(contract => ({
      ...contract,
      finalPrice: calculateFinalPrice({ basePrice: contract.salary }),
    }))
  }

  async getWorkContractById(id: string) {
    const contract = await this.repository.findById(id)
    if (!contract) {
      throw new Error('Work contract not found')
    }
    return {
      ...contract,
      finalPrice: calculateFinalPrice({ basePrice: contract.salary }),
    }
  }

  async createWorkContract(input: CreateWorkContractInput) {
    return this.repository.create(input)
  }

  async updateWorkContract(id: string, input: UpdateWorkContractInput) {
    return this.repository.update(id, input)
  }

  async deleteWorkContract(id: string) {
    return this.repository.delete(id)
  }
}