import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { FetchListTechnologiesByDeveloperUseCase } from './fetch-list-technologies-by-developer'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { makeTechnology } from 'test/factories/make-technology'
import { makeDeveloperTechnology } from 'test/factories/make-developer-technology'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let sut: FetchListTechnologiesByDeveloperUseCase

describe('Fetch list technologies by developer Use Case', () => {
  beforeEach(() => {
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()
    inMemoryDeveloperTechnologiesRepository =
      new InMemoryDeveloperTechnologiesRepository(
        inMemoryTechnologiesRepository,
      )
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    sut = new FetchListTechnologiesByDeveloperUseCase(
      inMemoryDeveloperTechnologiesRepository,
      inMemoryDevelopersRepository,
    )
  })

  it('should be able to fetch all technologies by developer', async () => {
    const technology01 = makeTechnology({ name: 'Docker' })
    const technology02 = makeTechnology({ name: 'Typescript' })
    const technology03 = makeTechnology({ name: 'Nodejs' })

    inMemoryTechnologiesRepository.items.push(technology01)
    inMemoryTechnologiesRepository.items.push(technology02)
    inMemoryTechnologiesRepository.items.push(technology03)

    const developer = makeDeveloper()
    inMemoryDevelopersRepository.items.push(developer)

    inMemoryTechnologiesRepository.items.map((item) => {
      const newItem = makeDeveloperTechnology({
        developerId: developer.id,
        technologyId: item.id,
      })
      return inMemoryDeveloperTechnologiesRepository.items.push(newItem)
    })

    const result = await sut.execute({
      developerId: developer.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      technologies: [
        expect.objectContaining({ name: 'Docker' }),
        expect.objectContaining({ name: 'Typescript' }),
        expect.objectContaining({ name: 'Nodejs' }),
      ],
    })
  })

  it('should be able only to fetch technologies of developer', async () => {
    const technology = makeTechnology({ name: 'Docker' })

    inMemoryTechnologiesRepository.items.push(technology)

    const developer01 = makeDeveloper()
    const developer02 = makeDeveloper()
    inMemoryDevelopersRepository.items.push(developer01)
    inMemoryDevelopersRepository.items.push(developer02)

    const developerTechnology = makeDeveloperTechnology({
      developerId: developer01.id,
      technologyId: technology.id,
    })
    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology)

    const result = await sut.execute({
      developerId: developer02.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      technologies: [],
    })
  })

  it('should not be able to fetch technologies with invalid developer ID', async () => {
    const technology01 = makeTechnology({ name: 'Docker' })
    const technology02 = makeTechnology({ name: 'Typescript' })

    inMemoryTechnologiesRepository.items.push(technology01)
    inMemoryTechnologiesRepository.items.push(technology02)

    const developer = makeDeveloper()
    inMemoryDevelopersRepository.items.push(developer)

    inMemoryTechnologiesRepository.items.map((item) => {
      const newItem = makeDeveloperTechnology({
        developerId: developer.id,
        technologyId: item.id,
      })
      return inMemoryDeveloperTechnologiesRepository.items.push(newItem)
    })

    const result = await sut.execute({
      developerId: 'Invalid-developer-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
