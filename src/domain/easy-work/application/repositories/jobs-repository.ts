import { PaginationParams } from '@/core/repositories/pagination-params'
import { Job } from '../../enterprise/entities/job'

export abstract class JobsRepository {
  abstract create(job: Job): Promise<void>
  abstract findById(id: string): Promise<Job | null>
  abstract findManyByCompanyId(
    param: PaginationParams,
    companyId: string,
  ): Promise<Job[]>
}
