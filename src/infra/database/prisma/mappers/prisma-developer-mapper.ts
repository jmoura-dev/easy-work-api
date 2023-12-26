import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Developer } from '@/domain/easy-work/enterprise/entities/user-developer'
import { Prisma, Developer as PrismaDeveloper } from '@prisma/client'

export class PrismaDeveloperMapper {
  static toDomain(raw: PrismaDeveloper): Developer {
    return Developer.create({
      userId: new UniqueEntityID(raw.userId),
      occupation_area: raw.occupation_area,
      price_per_hour: raw.price_per_hour ? Number(raw.price_per_hour) : null,
      available_for_contract: raw.available_for_contract ?? false,
    })
  }

  static toPrisma(developer: Developer): Prisma.DeveloperUncheckedCreateInput {
    return {
      userId: developer.userId.toString(),
      occupation_area: developer.occupation_area,
      price_per_hour: developer.price_per_hour,
      available_for_contract: developer.available_for_contract,
    }
  }
}
