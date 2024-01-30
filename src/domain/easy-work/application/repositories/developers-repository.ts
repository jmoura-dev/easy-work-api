import { PaginationParams } from '@/core/repositories/pagination-params'
import { Developer } from '../../enterprise/entities/user-developer'

export interface FindManyProps extends PaginationParams {
  name?: string
  occupation_area?: string
  techs: string[]
}

export abstract class DevelopersRepository {
  abstract create(developer: Developer): Promise<void>
  abstract findById(id: string): Promise<Developer | null>
  abstract findByUserId(userId: string): Promise<Developer | null>
  abstract findMany({
    name,
    occupation_area,
    techs,
    page,
  }: FindManyProps): Promise<Developer[]>

  abstract save(developer: Developer): Promise<void>
}
