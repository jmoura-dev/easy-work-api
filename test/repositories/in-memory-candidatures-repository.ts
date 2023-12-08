import { PaginationParams } from '@/core/repositories/pagination-params'
import { CandidaturesRepository } from '@/domain/easy-work/application/repositories/candidatures-repository'
import { Candidature } from '@/domain/easy-work/enterprise/entities/candidature'

export class InMemoryCandidaturesRepository implements CandidaturesRepository {
  public items: Candidature[] = []

  async create(candidature: Candidature): Promise<void> {
    this.items.push(candidature)
  }

  async findById(id: string): Promise<Candidature | null> {
    const candidature = this.items.find((item) => item.id.toString() === id)

    if (!candidature) {
      return null
    }

    return candidature
  }

  async findManyByJobId(
    { page }: PaginationParams,
    id: string,
  ): Promise<Candidature[]> {
    const candidatures = this.items
      .filter((item) => item.jobId.toString() === id)
      .slice((page - 1) * 20, page * 20)

    return candidatures
  }

  async save(candidature: Candidature): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === candidature.id)

    this.items[itemIndex] = candidature
  }
}
