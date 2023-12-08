import { faker } from '@faker-js/faker'
import {
  Technology,
  TechnologyProps,
} from '@/domain/easy-work/enterprise/entities/technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeTechnology(
  override: Partial<TechnologyProps> = {},
  id?: UniqueEntityID,
) {
  const technology = Technology.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return technology
}
