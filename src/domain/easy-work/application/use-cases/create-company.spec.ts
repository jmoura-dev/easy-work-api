import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { CreateCompanyUseCase } from './create-company'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'

let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryDevelopersRepository: InMemoryDevelopersRepository

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateCompanyUseCase

describe('Create company Use case', () => {
  beforeEach(() => {
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()
    inMemoryDeveloperTechnologiesRepository =
      new InMemoryDeveloperTechnologiesRepository(
        inMemoryTechnologiesRepository,
      )

    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository(
      inMemoryUsersRepository,
      inMemoryDeveloperTechnologiesRepository,
      inMemoryTechnologiesRepository,
    )
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
    sut = new CreateCompanyUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to create a new company', async () => {
    const user = makeUser()

    inMemoryUsersRepository.items.push(user)

    const company = makeCompany({
      userId: user.id,
      cnpj: '12.123.123/0001-12',
    })

    const result = await sut.execute({
      userId: company.userId.toString(),
      cnpj: company.cnpj,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items[0]).toMatchObject({
      cnpj: '12.123.123/0001-12',
    })
  })

  it('should not be able to create a new company when user do not exists', async () => {
    const company = makeCompany({
      userId: new UniqueEntityID('user-01'),
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: 'invalid-user',
      cnpj: company.cnpj,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
