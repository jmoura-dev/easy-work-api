import { Technology } from '@/domain/easy-work/enterprise/entities/technology'
import { Prisma, Technology as PrismaTechnology } from '@prisma/client'

export class PrismaTechnologyMapper {
  static toDomain(raw: PrismaTechnology): Technology {
    return Technology.create({
      name: raw.name,
    })
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
