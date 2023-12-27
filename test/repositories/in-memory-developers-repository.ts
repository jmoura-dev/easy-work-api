import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'
import { Developer } from '@/domain/easy-work/enterprise/entities/user-developer'

export class InMemoryDevelopersRepository implements DevelopersRepository {
  public items: Developer[] = []

  async create(developer: Developer): Promise<void> {
    this.items.push(developer)
  }

  async findById(id: string): Promise<Developer | null> {
    const developer = this.items.find((item) => item.id.toString() === id)

    if (!developer) {
      return null
    }

    return developer
  }

  async findByUserId(userId: string): Promise<Developer | null> {
    const developer = this.items.find(
      (item) => item.userId.toString() === userId,
    )

    if (!developer) {
      return null
    }

    return developer
  }

  async save(developer: Developer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === developer.id)

    this.items[itemIndex] = developer
  }
}
