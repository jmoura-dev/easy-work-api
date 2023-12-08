import { TechnologiesRepository } from '@/domain/easy-work/application/repositories/technologies-repository'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'

export class InMemoryTechnologiesRepository implements TechnologiesRepository {
  public items: Technology[] = []

  async create(technology: Technology): Promise<void> {
    this.items.push(technology)
  }

  async findByName(name: string): Promise<Technology | null> {
    const technology = this.items.find((item) => item.name === name)

    if (!technology) {
      return null
    }

    return technology
  }

  async findById(id: string): Promise<Technology | null> {
    const technology = this.items.find((item) => item.id.toString() === id)

    if (!technology) {
      return null
    }

    return technology
  }
}
