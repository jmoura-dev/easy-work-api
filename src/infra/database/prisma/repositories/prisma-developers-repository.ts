import {
  DevelopersRepository,
  FindManyProps,
} from '@/domain/easy-work/application/repositories/developers-repository'
import { Developer } from '@/domain/easy-work/enterprise/entities/user-developer'
import { Injectable } from '@nestjs/common'
import { PrismaDeveloperMapper } from '../mappers/prisma-developer-mapper'
import { PrismaService } from '../prisma.service'
import { Prisma } from '@prisma/client'
import { PrismaDeveloperWithTechnologiesMapper } from '../mappers/prisma-developer-with-technologies-mapper'
import { DeveloperWithTechnologies } from '@/domain/easy-work/enterprise/entities/value-objects/developer-with-technologies'

@Injectable()
export class PrismaDevelopersRepository implements DevelopersRepository {
  constructor(private prisma: PrismaService) {}

  async create(developer: Developer): Promise<void> {
    const data = PrismaDeveloperMapper.toPrisma(developer)

    await this.prisma.developer.create({
      data,
    })
  }

  async findById(id: string): Promise<Developer | null> {
    const developer = await this.prisma.developer.findUnique({
      where: {
        id,
      },
    })

    if (!developer) {
      return null
    }

    return PrismaDeveloperMapper.toDomain(developer)
  }

  async findByUserId(userId: string): Promise<Developer | null> {
    const developer = await this.prisma.developer.findUnique({
      where: {
        userId,
      },
    })

    if (!developer) {
      return null
    }

    return PrismaDeveloperMapper.toDomain(developer)
  }

  async findManyWithTechnologies({
    name,
    occupation_area,
    techs,
    page,
  }: FindManyProps): Promise<DeveloperWithTechnologies[]> {
    const where: Prisma.DeveloperWhereInput = {}

    if (name) {
      where.user = {
        name: {
          contains: name,
        },
      }
    }

    if (occupation_area) {
      where.occupation_area = occupation_area
    }

    if (techs && techs.length > 0) {
      where.developerTechnology = {
        every: {
          technology: {
            name: {
              in: techs,
            },
          },
        },
      }
    }

    const developers = await this.prisma.developer.findMany({
      where,
      include: {
        user: true,
        developerTechnology: {
          include: {
            technology: true,
          },
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return developers.map((developer) =>
      PrismaDeveloperWithTechnologiesMapper.toDomain(developer),
    )
  }

  async save(developer: Developer): Promise<void> {
    const data = PrismaDeveloperMapper.toPrisma(developer)

    await this.prisma.developer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
