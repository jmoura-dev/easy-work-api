import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'
import { Developer } from '@/domain/easy-work/enterprise/entities/user-developer'
import { Injectable } from '@nestjs/common'
import { PrismaDeveloperMapper } from '../mappers/prisma-developer-mapper'
import { PrismaService } from '../prisma.service'

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
