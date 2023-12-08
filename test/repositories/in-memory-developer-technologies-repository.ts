import { DeveloperTechnologiesRepository } from '@/domain/easy-work/application/repositories/developer-technologies-repository'
import { DeveloperTechnology } from '@/domain/easy-work/enterprise/entities/developer-technology'
import { InMemoryTechnologiesRepository } from './in-memory-technologies-repository'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'

export class InMemoryDeveloperTechnologiesRepository
  implements DeveloperTechnologiesRepository
{
  public items: DeveloperTechnology[] = []

  constructor(
    private inMemoryTechnologiesRepository: InMemoryTechnologiesRepository,
  ) {}

  async create(developerTechnology: DeveloperTechnology): Promise<void> {
    this.items.push(developerTechnology)
  }

  async findManyByTechnologyId(
    technologyId: string,
  ): Promise<DeveloperTechnology[]> {
    const developerTechnologies = this.items.filter(
      (item) => item.technologyId.toString() === technologyId,
    )

    return developerTechnologies
  }

  async findManyByDeveloperId(developerId: string): Promise<Technology[]> {
    const developerTechnologies = this.items.filter(
      (item) => item.developerId.toString() === developerId,
    )

    const arrayTechnologyId = developerTechnologies.map((item) =>
      item.technologyId.toString(),
    )

    const arrayTechnology = arrayTechnologyId.map((technologyId) =>
      this.inMemoryTechnologiesRepository.findById(technologyId),
    )

    const technologies = (await Promise.all(
      arrayTechnology.filter((item) => item !== null),
    )) as Technology[]

    return technologies
  }
}
