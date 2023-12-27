import { faker } from '@faker-js/faker'
import {
  Developer,
  DeveloperProps,
} from '@/domain/easy-work/enterprise/entities/user-developer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaDeveloperMapper } from '@/infra/database/prisma/mappers/prisma-developer-mapper'

export function makeDeveloper(
  override: Partial<DeveloperProps> = {},
  id?: UniqueEntityID,
) {
  const developer = Developer.create(
    {
      userId: new UniqueEntityID(),
      occupation_area: faker.internet.userName(),
      ...override,
    },
    id,
  )

  return developer
}

@Injectable()
export class DeveloperFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeveloper(
    data: Partial<DeveloperProps> = {},
  ): Promise<Developer> {
    const developer = makeDeveloper(data)

    await this.prisma.developer.create({
      data: PrismaDeveloperMapper.toPrisma(developer),
    })

    return developer
  }
}
