import { TechnologiesRepository } from '@/domain/easy-work/application/repositories/technologies-repository'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'
import { PrismaTechnologyMapper } from '../mappers/prisma-technology-mapper'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaTechnologiesRepository implements TechnologiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(technology: Technology): Promise<void> {
    const data = PrismaTechnologyMapper.toPrisma(technology)

    await this.prisma.technology.create({
      data,
    })
  }

  async findByName(name: string): Promise<Technology | null> {
    const technology = await this.prisma.technology.findFirst({
      where: {
        name,
      },
    })

    if (!technology) {
      return null
    }

    return PrismaTechnologyMapper.toDomain(technology)
  }

  async findById(id: string): Promise<Technology | null> {
    const technology = await this.prisma.technology.findUnique({
      where: {
        id,
      },
    })

    if (!technology) {
      return null
    }

    return PrismaTechnologyMapper.toDomain(technology)
  }
}
