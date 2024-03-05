import { PaginationParams } from '@/core/repositories/pagination-params'
import { JobsRepository } from '@/domain/easy-work/application/repositories/jobs-repository'
import { Job } from '@/domain/easy-work/enterprise/entities/job'
import { JobWithCompany } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-company'

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

  async findMany({ page }: PaginationParams): Promise<JobWithCompany[]> {
    const jobsWithCompanies = this.items.map((job) => {
      return JobWithCompany.create({
        jobId: job.id,
        companyName: 'random company',
        title: job.title,
        workMode: job.workMode,
        workSchedule: job.workSchedule,
        remuneration: job.remuneration,
        hoursPerWeek: job.hoursPerWeek,
        description: job.description,
        created_at: job.created_at,
      })
    })

    const jobs = jobsWithCompanies.slice((page - 1) * 20, page * 20)

    return jobs
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
