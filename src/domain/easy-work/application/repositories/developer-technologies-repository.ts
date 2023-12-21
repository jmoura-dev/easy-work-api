import { DeveloperTechnology } from '../../enterprise/entities/developer-technology'
import { Technology } from '../../enterprise/entities/technology'

export abstract class DeveloperTechnologiesRepository {
  abstract create(developerTechnology: DeveloperTechnology): Promise<void>
  abstract findManyByTechnologyId(
    technologyId: string,
  ): Promise<DeveloperTechnology[]>

  abstract findManyByDeveloperId(developerId: string): Promise<Technology[]>
}
