import {
  DeveloperTechnology,
  DeveloperTechnologyProps,
} from '@/domain/easy-work/enterprise/entities/developer-technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaDeveloperTechnologyMapper } from '@/infra/database/prisma/mappers/prisma-developer-technology-mapper'

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

@Injectable()
export class DeveloperTechnologyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeveloper(
    data: Partial<DeveloperTechnologyProps> = {},
  ): Promise<DeveloperTechnology> {
    const developerTechnology = makeDeveloperTechnology(data)

    await this.prisma.developerTechnology.create({
      data: PrismaDeveloperTechnologyMapper.toPrisma(developerTechnology),
    })

    return developerTechnology
  }
}
