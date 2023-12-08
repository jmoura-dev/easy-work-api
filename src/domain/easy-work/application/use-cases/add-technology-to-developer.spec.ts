import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { AddTechnologyToDeveloperUseCase } from './add-technology-to-developer'
import { makeDeveloper } from 'test/factories/make-developer'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { makeTechnology } from 'test/factories/make-technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeveloperTechnology } from 'test/factories/make-developer-technology'
import { TechnologyAlreadyAddedInTheDeveloper } from './errors/technology-already-added-in-the-developer.erro'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let sut: AddTechnologyToDeveloperUseCase

describe('Add technology to developer Use Case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()

    inMemoryDeveloperTechnologiesRepository =
      new InMemoryDeveloperTechnologiesRepository(
        inMemoryTechnologiesRepository,
      )
    sut = new AddTechnologyToDeveloperUseCase(
      inMemoryDeveloperTechnologiesRepository,
    )
  })

  it('should be able to add new technology to developer', async () => {
    const developer = makeDeveloper({}, new UniqueEntityID('developer-01'))
    const technology = makeTechnology()

    inMemoryDevelopersRepository.items.push(developer)
    inMemoryTechnologiesRepository.items.push(technology)

    const result = await sut.execute({
      developerId: developer.id.toString(),
      technologyId: technology.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(
      inMemoryDeveloperTechnologiesRepository.items[0].developerId,
    ).toEqual(new UniqueEntityID('developer-01'))
  })

  it('should not be able to add repeated technology to the same developer ', async () => {
    const developer = makeDeveloper({}, new UniqueEntityID('developer-01'))
    const technology = makeTechnology()
    const developerTechnology = makeDeveloperTechnology({
      developerId: developer.id,
      technologyId: technology.id,
    })

    inMemoryDeveloperTechnologiesRepository.items.push(developerTechnology)

    const result = await sut.execute({
      developerId: developer.id.toString(),
      technologyId: technology.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TechnologyAlreadyAddedInTheDeveloper)
  })
})
