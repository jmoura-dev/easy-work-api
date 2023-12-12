import { faker } from '@faker-js/faker'
import {
  Company,
  CompanyProps,
} from '@/domain/easy-work/enterprise/entities/user-company'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeCompany(
  override: Partial<CompanyProps> = {},
  id?: UniqueEntityID,
) {
  const company = Company.create(
    {
      name: faker.lorem.word(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      cnpj: faker.string.numeric(14),
      ...override,
    },
    id,
  )

  return company
}
