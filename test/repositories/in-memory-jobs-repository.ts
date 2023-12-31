import { PaginationParams } from '@/core/repositories/pagination-params'
import { JobsRepository } from '@/domain/easy-work/application/repositories/jobs-repository'
import { Job } from '@/domain/easy-work/enterprise/entities/job'

export class InMemoryJobsRepository implements JobsRepository {
  public items: Job[] = []

  async create(job: Job): Promise<void> {
    this.items.push(job)
  }

  async findById(id: string): Promise<Job | null> {
    const job = this.items.find((item) => item.id.toString() === id)

    if (!job) {
      return null
    }

    return job
  }

  async findBySlug(slug: string): Promise<Job | null> {
    const job = this.items.find((item) => item.slug.value === slug)

    if (!job) {
      return null
    }

    return job
  }

  async findManyByCompanyId(
    { page }: PaginationParams,
    companyId: string,
  ): Promise<Job[]> {
    const jobs = this.items
      .filter((item) => item.companyId.toString() === companyId)
      .slice((page - 1) * 20, page * 20)

    return jobs
  }
}
