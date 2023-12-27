import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeveloperTechnology } from '@/domain/easy-work/enterprise/entities/developer-technology'
import {
  Prisma,
  DeveloperTechnology as PrismaDeveloperTechnology,
} from '@prisma/client'

export class PrismaDeveloperTechnologyMapper {
  static toDomain(raw: PrismaDeveloperTechnology): DeveloperTechnology {
    return DeveloperTechnology.create(
      {
        developerId: new UniqueEntityID(raw.developerId),
        technologyId: new UniqueEntityID(raw.technologyId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    developerTechnology: DeveloperTechnology,
  ): Prisma.DeveloperTechnologyUncheckedCreateInput {
    return {
      id: developerTechnology.id.toString(),
      developerId: developerTechnology.developerId.toString(),
      technologyId: developerTechnology.technologyId.toString(),
    }
  }
}
