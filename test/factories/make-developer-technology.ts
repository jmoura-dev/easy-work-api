import {
  DeveloperTechnology,
  DeveloperTechnologyProps,
} from '@/domain/easy-work/enterprise/entities/developer-technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeDeveloperTechnology(
  override: Partial<DeveloperTechnologyProps> = {},
  id?: UniqueEntityID,
) {
  const developerTechnology = DeveloperTechnology.create(
    {
      developerId: new UniqueEntityID(),
      technologyId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return developerTechnology
}
