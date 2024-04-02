import { makeTechnology } from 'test/factories/make-technology'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UpdateDeveloperTechnologiesUseCase } from './update-developer-technologies'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeUser } from 'test/factories/make-user'
import { makeDeveloper } from 'test/factories/make-developer'
import { makeDeveloperTechnology } from 'test/factories/make-developer-technology'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository

let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let sut: UpdateDeveloperTechnologiesUseCase

describe('Update developer technologies', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )

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

    sut = new UpdateDeveloperTechnologiesUseCase(
      inMemoryDeveloperTechnologiesRepository,
      inMemoryDevelopersRepository,
      inMemoryTechnologiesRepository,
    )
  })

  it('should be able to update developer technologies', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const developer = makeDeveloper({
      userId: user.id,
    })
    inMemoryDevelopersRepository.items.push(developer)

    const technology01 = makeTechnology({ name: 'Docker' })
    const technology02 = makeTechnology({ name: 'Typescript' })
    const technology03 = makeTechnology({ name: 'Java' })
    const technology04 = makeTechnology({ name: 'Next' })
    const technology05 = makeTechnology({ name: 'React' })

    inMemoryTechnologiesRepository.items.push(technology01)
    inMemoryTechnologiesRepository.items.push(technology02)
    inMemoryTechnologiesRepository.items.push(technology03)
    inMemoryTechnologiesRepository.items.push(technology04)
    inMemoryTechnologiesRepository.items.push(technology05)

    const developerTechnology01 = makeDeveloperTechnology({
      developerId: developer.id,
      technologyId: technology01.id,
    })
    const developerTechnology02 = makeDeveloperTechnology({
      developerId: developer.id,
      technologyId: technology02.id,
    })
    const developerTechnology03 = makeDeveloperTechnology({
      developerId: developer.id,
      technologyId: technology03.id,
    })
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology01)
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology02)
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology03)

    const techs = [
      { name: 'Docker' },
      { name: 'Typescript' },
      { name: 'Next' },
      { name: 'React' },
    ]

    const result = await sut.execute({
      userId: user.id.toString(),
      techs,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeveloperTechnologiesRepository.items.length).toEqual(4)
    expect(inMemoryDeveloperTechnologiesRepository.items).toEqual([
      expect.objectContaining({
        developerId: developer.id,
        technologyId: technology01.id,
      }),
      expect.objectContaining({
        developerId: developer.id,
        technologyId: technology02.id,
      }),
      expect.objectContaining({
        developerId: developer.id,
        technologyId: technology04.id,
      }),
      expect.objectContaining({
        developerId: developer.id,
        technologyId: technology05.id,
      }),
    ])
  })

  it('should not be able to update developer technologies with invalid-id', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const developer = makeDeveloper({
      userId: user.id,
    })
    inMemoryDevelopersRepository.items.push(developer)

    const technology01 = makeTechnology({ name: 'Docker' })
    const technology02 = makeTechnology({ name: 'Typescript' })
    inMemoryTechnologiesRepository.items.push(technology01)
    inMemoryTechnologiesRepository.items.push(technology02)

    const developerTechnology01 = makeDeveloperTechnology({
      developerId: developer.id,
      technologyId: technology01.id,
    })
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology01)

    const result = await sut.execute({
      userId: 'invalid-user-ID',
      techs: [{ name: 'Docker' }, { name: 'Typescript' }],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
