import { DeveloperTechnology } from '../../enterprise/entities/developer-technology'
import { Technology } from '../../enterprise/entities/technology'

export interface FindDeveloperTechnologyByParamsProps {
  technologyId: string
  developerId: string
}

export abstract class DeveloperTechnologiesRepository {
  abstract create(developerTechnology: DeveloperTechnology): Promise<void>
  abstract findManyByTechnologyId(
    technologyId: string,
  ): Promise<DeveloperTechnology[]>

  abstract findById(
    params: FindDeveloperTechnologyByParamsProps,
  ): Promise<DeveloperTechnology | null>

  abstract findManyByDeveloperId(developerId: string): Promise<Technology[]>
  abstract delete(id: string): Promise<void>
}
