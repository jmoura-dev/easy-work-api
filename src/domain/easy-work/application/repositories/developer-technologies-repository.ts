import { DeveloperTechnology } from '../../enterprise/entities/developer-technology'
import { Technology } from '../../enterprise/entities/technology'

export interface DeveloperTechnologiesRepository {
  create(developerTechnology: DeveloperTechnology): Promise<void>
  findManyByTechnologyId(technologyId: string): Promise<DeveloperTechnology[]>
  findManyByDeveloperId(developerId: string): Promise<Technology[]>
}
