import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { GetDeveloperDetailsUseCase } from './get-developer-details'
import { makeUser } from 'test/factories/make-user'
import { makeDeveloper } from 'test/factories/make-developer'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetDeveloperDetailsUseCase

describe('Get developer details by id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()
    inMemoryDeveloperTechnologiesRepository =
      new InMemoryDeveloperTechnologiesRepository(
        inMemoryTechnologiesRepository,
      )
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository(
      inMemoryUsersRepository,
      inMemoryDeveloperTechnologiesRepository,
      inMemoryTechnologiesRepository,
    )
    sut = new GetDeveloperDetailsUseCase(
      inMemoryUsersRepository,
      inMemoryDevelopersRepository,
    )
  })

  it('should be able to get details developer by id', async () => {
    const user = makeUser({
      name: 'Jackson Moura',
      about: 'Desenvolvedor focado em melhorar',
    })
    const developer = makeDeveloper({
      userId: user.id,
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      developerWithDetails: expect.objectContaining({
        userName: 'Jackson Moura',
        about: 'Desenvolvedor focado em melhorar',
      }),
    })
  })

  it('should not be able to get details with invalid user-id', async () => {
    const user = makeUser({
      name: 'Jackson Moura',
      about: 'Desenvolvedor focado em melhorar',
    })
    const developer = makeDeveloper({
      userId: user.id,
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      userId: 'invalid-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
