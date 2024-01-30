import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetAllDevelopersUseCase } from './get-all-developers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTechnology } from 'test/factories/make-technology'
import { makeDeveloperTechnology } from 'test/factories/make-developer-technology'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: GetAllDevelopersUseCase

describe('Get all developers Use Case', () => {
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
    sut = new GetAllDevelopersUseCase(inMemoryDevelopersRepository)
  })

  it('should be able to fetch all developers without any query params', async () => {
    for (let i = 1; i < 23; i++) {
      const user = makeUser({}, new UniqueEntityID(`${i}`))
      inMemoryUsersRepository.items.push(user)

      const developer = makeDeveloper(
        { userId: user.id },
        new UniqueEntityID(`${i}`),
      )
      inMemoryDevelopersRepository.items.push(developer)
    }

    const result = await sut.execute({
      techs: [],
      page: 2,
    })

    expect(result.developers.length).toBe(2)
    expect(result.developers).toEqual([
      expect.objectContaining({ id: new UniqueEntityID('21') }),
      expect.objectContaining({ id: new UniqueEntityID('22') }),
    ])
  })

  it('should be able to fetch developers by query params', async () => {
    for (let i = 1; i < 10; i++) {
      const user = makeUser({}, new UniqueEntityID(`${i}`))
      inMemoryUsersRepository.items.push(user)

      const developer = makeDeveloper(
        { userId: user.id, occupation_area: 'FullStack' },
        new UniqueEntityID(`${i}`),
      )
      inMemoryDevelopersRepository.items.push(developer)
    }

    const tech01 = makeTechnology({ name: 'Typescript' })
    const tech02 = makeTechnology({ name: 'Docker' })
    inMemoryTechnologiesRepository.items.push(tech01)
    inMemoryTechnologiesRepository.items.push(tech02)

    const developerTechnology01 = makeDeveloperTechnology({
      technologyId: tech01.id,
      developerId: new UniqueEntityID('3'),
    })
    const developerTechnology02 = makeDeveloperTechnology({
      technologyId: tech02.id,
      developerId: new UniqueEntityID('3'),
    })
    const developerTechnology03 = makeDeveloperTechnology({
      technologyId: tech01.id,
      developerId: new UniqueEntityID('2'),
    })
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology01)
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology02)
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology03)

    const result = await sut.execute({
      occupation_area: 'FullStack',
      techs: ['Docker', 'Typescript'],
      page: 1,
    })

    expect(result.developers.length).toBe(1)
    expect(result.developers).toEqual([
      expect.objectContaining({ id: new UniqueEntityID('3') }),
    ])
  })
})
