import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { EditDeveloperDataUseCase } from './edit-developer-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: EditDeveloperDataUseCase

describe('Edit developer data Use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    sut = new EditDeveloperDataUseCase(inMemoryDevelopersRepository)
  })

  it('should be able update developer data', async () => {
    const developer = makeDeveloper({
      occupation_area: 'Backend',
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      developerId: developer.id.toString(),
      occupation_area: 'Frontend',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDevelopersRepository.items[0].occupation_area).toEqual(
      'Frontend',
    )
  })

  it('should not be able to update developer data with invalid id', async () => {
    const developer = makeDeveloper(
      {
        occupation_area: 'Backend',
      },
      new UniqueEntityID('developer-01'),
    )

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      developerId: 'invalid-developer-id',
      occupation_area: 'FullStack',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
