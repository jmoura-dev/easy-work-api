import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/easy-work/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
      avatarId: raw.avatarId ? new UniqueEntityID(raw.avatarId) : null,
      about: raw.about,
    })
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      avatarId: user.avatarId?.toString(),
      about: user.about,
    }
  }
}
