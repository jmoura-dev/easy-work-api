import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'
import { Prisma, Technology as PrismaTechnology } from '@prisma/client'

export class PrismaTechnologyMapper {
  static toDomain(raw: PrismaTechnology): Technology {
    return Technology.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    technology: Technology,
  ): Prisma.TechnologyUncheckedCreateInput {
    return {
      id: technology.id.toString(),
      name: technology.name,
    }
  }
}
