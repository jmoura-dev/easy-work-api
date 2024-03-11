import {
  Technology as PrismaTechnology,
  User as PrismaUser,
  Developer as PrismaDeveloper,
  Avatar as PrismaAvatar,
} from '@prisma/client'
import { DeveloperWithTechnologies } from '@/domain/easy-work/enterprise/entities/value-objects/developer-with-technologies'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaTechnologyMapper } from './prisma-technology-mapper'

type PrismaDeveloperWithTechnologies = PrismaDeveloper & {
  user: PrismaUser & {
    avatar: PrismaAvatar | null
  }
  developerTechnology: {
    technology: PrismaTechnology
  }[]
}

export class PrismaDeveloperWithTechnologiesMapper {
  static toDomain(
    raw: PrismaDeveloperWithTechnologies,
  ): DeveloperWithTechnologies {
    return DeveloperWithTechnologies.create({
      developerId: new UniqueEntityID(raw.id),
      avatarUrl: raw.user.avatar ? raw.user.avatar.url : null,
      userName: raw.user.name,
      occupation_area: raw.occupation_area,
      price_per_hour: Number(raw.price_per_hour),
      available_for_contract: raw.available_for_contract ?? false,
      about: raw.user.about,
      techs: raw.developerTechnology.map((tech) =>
        PrismaTechnologyMapper.toDomain(tech.technology),
      ),
    })
  }
}
