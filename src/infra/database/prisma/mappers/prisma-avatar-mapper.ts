import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Avatar } from '@/domain/easy-work/enterprise/entities/avatar'
import { Prisma, Avatar as PrismaAvatar } from '@prisma/client'

export class PrismaAvatarMapper {
  static toDomain(raw: PrismaAvatar): Avatar {
    return Avatar.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(avatar: Avatar): Prisma.AvatarUncheckedCreateInput {
    return {
      id: avatar.id.toString(),
      title: avatar.title,
      url: avatar.url,
    }
  }
}
