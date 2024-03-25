import { PaginationParams } from '@/core/repositories/pagination-params'
import { Job } from '../../enterprise/entities/job'
import { JobWithCompany } from '../../enterprise/entities/value-objects/job-with-company'
import { JobWithCandidaturesAmount } from '../../enterprise/entities/value-objects/job-with-candidatures-amount'

export abstract class JobsRepository {
  abstract create(job: Job): Promise<void>
  abstract findById(id: string): Promise<Job | null>
  abstract findMany(param: PaginationParams): Promise<JobWithCompany[]>
  abstract findManyByCompanyId(
    param: PaginationParams,
    companyId: string,
  ): Promise<Job[]>

  abstract findManyWithCandidaturesAmount(
    companyId: string,
  ): Promise<JobWithCandidaturesAmount[]>
}
