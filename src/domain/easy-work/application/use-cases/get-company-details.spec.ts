import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetCompanyDetailsUseCase } from './get-company-details'
import { makeCompany } from 'test/factories/make-company'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetCompanyDetailsUseCase

describe('Get company details by id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new GetCompanyDetailsUseCase(
      inMemoryUsersRepository,
      inMemoryCompaniesRepository,
    )
  })

  it('should be able to get details company by id', async () => {
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      companyWithDetails: expect.objectContaining({
        companyId: company.id,
        userName: 'Jackson Moura',
      }),
    })
  })

  it('should not be able to get details with invalid user-id', async () => {
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: 'invalid-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
