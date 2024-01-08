import { AvataresRepository } from '@/domain/easy-work/application/repositories/avatares-repository'
import { Avatar } from '@/domain/easy-work/enterprise/entities/avatar'

export class InMemoryAvataresRepository implements AvataresRepository {
  public items: Avatar[] = []

  async create(avatar: Avatar): Promise<void> {
    this.items.push(avatar)
  }
}
