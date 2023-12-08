import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { EditDeveloperDataUseCase } from './edit-developer-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: EditDeveloperDataUseCase

describe('Edit developer data Use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    sut = new EditDeveloperDataUseCase(inMemoryDevelopersRepository)
  })

  it('should be able update developer data', async () => {
    const developer = makeDeveloper({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      name: 'João Doe',
      email: 'john@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDevelopersRepository.items[0].name).toEqual('João Doe')
  })

  it('should not be able to update developer data with invalid email', async () => {
    const developer = makeDeveloper({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      name: 'João Doe',
      email: 'invalid@email.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
