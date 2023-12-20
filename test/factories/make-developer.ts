import { faker } from '@faker-js/faker'
import {
  Developer,
  DeveloperProps,
} from '@/domain/easy-work/enterprise/entities/user-developer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeDeveloper(
  override: Partial<DeveloperProps> = {},
  id?: UniqueEntityID,
) {
  const developer = Developer.create(
    {
      userId: new UniqueEntityID(),
      occupation_area: faker.internet.userName(),
      ...override,
    },
    id,
  )

  return developer
}
