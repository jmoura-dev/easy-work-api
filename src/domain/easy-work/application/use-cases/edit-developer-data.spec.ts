import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { EditDeveloperDataUseCase } from './edit-developer-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeUser } from 'test/factories/make-user'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: EditDeveloperDataUseCase

describe('Edit developer data Use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
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
    sut = new EditDeveloperDataUseCase(inMemoryDevelopersRepository)
  })

  it('should be able update developer data', async () => {
    const user = makeUser()
    const developer = makeDeveloper({
      userId: user.id,
      occupation_area: 'Backend',
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      userId: user.id.toString(),
      occupation_area: 'Frontend',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDevelopersRepository.items[0].occupation_area).toEqual(
      'Frontend',
    )
  })

  it('should not be able to update developer data with invalid id', async () => {
    const user = makeUser()
    const developer = makeDeveloper({
      userId: user.id,
      occupation_area: 'Backend',
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      userId: 'invalid-user-id',
      occupation_area: 'FullStack',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
