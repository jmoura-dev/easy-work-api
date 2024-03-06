import { PaginationParams } from '@/core/repositories/pagination-params'
import { Candidature } from '../../enterprise/entities/candidature'
import { CandidatureWithJobAndCompany } from '../../enterprise/entities/value-objects/candidature-with-job-and-company'

export abstract class CandidaturesRepository {
  abstract create(candidature: Candidature): Promise<void>
  abstract findById(id: string): Promise<Candidature | null>
  abstract findManyByJobId(
    param: PaginationParams,
    jobId: string,
  ): Promise<Candidature[]>

  abstract findManyByDeveloperId(
    param: PaginationParams,
    developerId: string,
  ): Promise<CandidatureWithJobAndCompany[]>

  abstract findMany(developerId: string): Promise<Candidature[]>
  abstract save(candidature: Candidature): Promise<void>
}
