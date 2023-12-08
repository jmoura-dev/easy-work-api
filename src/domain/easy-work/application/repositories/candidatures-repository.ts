import { PaginationParams } from '@/core/repositories/pagination-params'
import { Candidature } from '../../enterprise/entities/candidature'

export interface CandidaturesRepository {
  create(candidature: Candidature): Promise<void>
  findById(id: string): Promise<Candidature | null>
  findManyByJobId(param: PaginationParams, id: string): Promise<Candidature[]>
  save(candidature: Candidature): Promise<void>
}
