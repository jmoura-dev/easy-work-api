import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AvatarProps,
  Avatar,
} from '@/domain/easy-work/enterprise/entities/avatar'
import { faker } from '@faker-js/faker'

export function makeAvatar(
  override: Partial<AvatarProps> = {},
  id?: UniqueEntityID,
) {
  const avatar = Avatar.create(
    {
      title: faker.lorem.sentence(1),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return avatar
}
