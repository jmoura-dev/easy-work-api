import { DeveloperTechnologiesRepository } from '@/domain/easy-work/application/repositories/developer-technologies-repository'
import { DeveloperTechnology } from '@/domain/easy-work/enterprise/entities/developer-technology'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'
import { PrismaService } from '../prisma.service'
import { PrismaDeveloperTechnologyMapper } from '../mappers/prisma-developer-technology-mapper'
import { PrismaTechnologyMapper } from '../mappers/prisma-technology-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaDeveloperTechnologiesRepository
  implements DeveloperTechnologiesRepository
{
  constructor(private prisma: PrismaService) {}

  async create(developerTechnology: DeveloperTechnology): Promise<void> {
    const data = PrismaDeveloperTechnologyMapper.toPrisma(developerTechnology)

    await this.prisma.developerTechnology.create({
      data,
    })
  }

  async findManyByTechnologyId(
    technologyId: string,
  ): Promise<DeveloperTechnology[]> {
    const developerTechnologies =
      await this.prisma.developerTechnology.findMany({
        where: {
          technologyId,
        },
      })

    return developerTechnologies.map((item) =>
      PrismaDeveloperTechnologyMapper.toDomain(item),
    )
  }

  async findManyByDeveloperId(developerId: string): Promise<Technology[]> {
    const developerTechnologies =
      await this.prisma.developerTechnology.findMany({
        where: {
          developerId,
        },
      })

    const arrayTechnologies = await Promise.all(
      developerTechnologies.map((item) =>
        this.prisma.technology.findUnique({
          where: {
            id: item.technologyId,
          },
        }),
      ),
    )

    const technologies = arrayTechnologies.flatMap((item) =>
      item ? [item] : [],
    )

    return technologies.map((item) => PrismaTechnologyMapper.toDomain(item))
  }
}
