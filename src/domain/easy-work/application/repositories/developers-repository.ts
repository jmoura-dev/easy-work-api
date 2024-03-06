import { PaginationParams } from '@/core/repositories/pagination-params'
import { Developer } from '../../enterprise/entities/user-developer'
import { DeveloperWithTechnologies } from '../../enterprise/entities/value-objects/developer-with-technologies'

export interface FindManyProps extends PaginationParams {
  name?: string
  occupation_area?: string
  techs: string[]
}

export abstract class DevelopersRepository {
  abstract create(developer: Developer): Promise<void>
  abstract findById(id: string): Promise<Developer | null>
  abstract findByUserId(userId: string): Promise<Developer | null>
  abstract findManyWithTechnologies({
    name,
    occupation_area,
    techs,
    page,
  }: FindManyProps): Promise<DeveloperWithTechnologies[]>

  abstract findDetailsById(
    id: string,
  ): Promise<DeveloperWithTechnologies | null>

  abstract save(developer: Developer): Promise<void>
}
