import { faker } from '@faker-js/faker'
import { User, UserProps } from '@/domain/easy-work/enterprise/entities/user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.lorem.word(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}
