import { faker } from '@faker-js/faker'
import {
  Technology,
  TechnologyProps,
} from '@/domain/easy-work/enterprise/entities/technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaTechnologyMapper } from '@/infra/database/prisma/mappers/prisma-technology-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeTechnology(
  override: Partial<TechnologyProps> = {},
  id?: UniqueEntityID,
) {
  const technology = Technology.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return technology
}

@Injectable()
export class TechnologyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTechnology(
    data: Partial<TechnologyProps> = {},
  ): Promise<Technology> {
    const technology = makeTechnology(data)

    await this.prisma.technology.create({
      data: PrismaTechnologyMapper.toPrisma(technology),
    })

    return technology
  }
}
