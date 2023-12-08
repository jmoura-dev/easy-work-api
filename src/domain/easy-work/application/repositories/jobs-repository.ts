import { PaginationParams } from '@/core/repositories/pagination-params'
import { Job } from '../../enterprise/entities/job'

export interface JobsRepository {
  create(job: Job): Promise<void>
  findById(id: string): Promise<Job | null>
  findManyByCompanyId(param: PaginationParams, id: string): Promise<Job[]>
}
