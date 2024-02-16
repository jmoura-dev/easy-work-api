import { UsersRepository } from '@/domain/easy-work/application/repositories/users-repository'
import { User } from '@/domain/easy-work/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaService } from '../prisma.service'
import { UserWithRole } from '@/domain/easy-work/enterprise/entities/value-objects/user-with-role'
import { PrismaUserWithRoleMapper } from '../mappers/prisma-user-with-role-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<UserWithRole | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        company: true,
        developer: true,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserWithRoleMapper.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
