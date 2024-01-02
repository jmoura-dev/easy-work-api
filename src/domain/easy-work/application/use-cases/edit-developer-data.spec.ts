import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { EditDeveloperDataUseCase } from './edit-developer-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeUser } from 'test/factories/make-user'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: EditDeveloperDataUseCase

describe('Edit developer data Use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
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
