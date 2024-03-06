import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CandidaturesRepository } from '@/domain/easy-work/application/repositories/candidatures-repository'
import { Candidature } from '@/domain/easy-work/enterprise/entities/candidature'
import { CandidatureWithJobAndCompany } from '@/domain/easy-work/enterprise/entities/value-objects/candidature-with-job-and-company'

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
    jobId: string,
  ): Promise<Candidature[]> {
    const candidatures = this.items
      .filter((item) => item.jobId.toString() === jobId)
      .slice((page - 1) * 20, page * 20)

    return candidatures
  }

  async findManyByDeveloperId(
    { page }: PaginationParams,
    developerId: string,
  ): Promise<CandidatureWithJobAndCompany[]> {
    const candidatures = this.items
      .filter((item) => item.developerId.toString() === developerId)
      .slice((page - 1) * 20, page * 20)

    const candidaturesData = candidatures.map((item) => {
      return CandidatureWithJobAndCompany.create({
        candidatureId: item.id,
        jobTitle: 'New job',
        companyName: 'CompanyName',
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt ? item.updatedAt : null,
      })
    })

    return candidaturesData
  }

  async findMany(developerId: string): Promise<Candidature[]> {
    const candidatures = this.items.filter(
      (item) => item.developerId.toString() === developerId,
    )

    return candidatures
  }

  async save(candidature: Candidature): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === candidature.id)

    this.items[itemIndex] = candidature

    DomainEvents.dispatchEventsForAggregate(candidature.id)
  }
}
