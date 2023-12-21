import { PaginationParams } from '@/core/repositories/pagination-params'
import { Candidature } from '../../enterprise/entities/candidature'

export abstract class CandidaturesRepository {
  abstract create(candidature: Candidature): Promise<void>
  abstract findById(id: string): Promise<Candidature | null>
  abstract findManyByJobId(
    param: PaginationParams,
    id: string,
  ): Promise<Candidature[]>

  abstract save(candidature: Candidature): Promise<void>
}
