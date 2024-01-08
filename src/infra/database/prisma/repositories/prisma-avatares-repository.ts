import { AvataresRepository } from '@/domain/easy-work/application/repositories/avatares-repository'
import { Avatar } from '@/domain/easy-work/enterprise/entities/avatar'
import { PrismaAvatarMapper } from '../mappers/prisma-avatar-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAvataresRepository implements AvataresRepository {
  constructor(private prisma: PrismaService) {}

  async create(avatar: Avatar): Promise<void> {
    const data = PrismaAvatarMapper.toPrisma(avatar)

    await this.prisma.avatar.create({
      data,
    })
  }
}
