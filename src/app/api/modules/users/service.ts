import { UsersRepository } from './repository'
import type { UpdateUserInput } from './types'

export class UsersService {
  private repository = new UsersRepository()

  async getAllUsers() {
    return this.repository.findAll()
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async updateUser(id: string, input: UpdateUserInput) {
    return this.repository.update(id, input)
  }

  async deleteUser(id: string) {
    return this.repository.delete(id)
  }
}