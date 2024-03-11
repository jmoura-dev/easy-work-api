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
    const initialWhere: Prisma.DeveloperWhereInput = {}

    if (name) {
      initialWhere.user = {
        name: {
          contains: name,
        },
      }
    }

    if (occupation_area) {
      initialWhere.occupation_area = occupation_area
    }

    const developersNoFilterByTech = await this.prisma.developer.findMany({
      where: initialWhere,
      include: {
        user: {
          include: {
            avatar: true,
          },
        },
        developerTechnology: {
          include: {
            technology: true,
          },
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    if (!techs || techs.length === 0) {
      return developersNoFilterByTech.map((developer) =>
        PrismaDeveloperWithTechnologiesMapper.toDomain(developer),
      )
    }

    const filteredDevelopersWithTechs = developersNoFilterByTech.filter(
      (developer) =>
        techs.every((tech) =>
          developer.developerTechnology.find(
            (devTech) => devTech.technology.name === tech,
          ),
        ),
    )

    return filteredDevelopersWithTechs.map((developer) =>
      PrismaDeveloperWithTechnologiesMapper.toDomain(developer),
    )
  }

  async findDetailsById(id: string): Promise<DeveloperWithTechnologies | null> {
    const developerWithDetails = await this.prisma.developer.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            avatar: true,
          },
        },
        developerTechnology: {
          include: {
            technology: true,
          },
        },
      },
    })

    if (!developerWithDetails) {
      return null
    }

    return PrismaDeveloperWithTechnologiesMapper.toDomain(developerWithDetails)
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
