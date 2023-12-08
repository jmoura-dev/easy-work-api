import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { CreateDeveloperUseCase } from './create-developer'
import { makeDeveloper } from 'test/factories/make-developer'
import { EmailAlreadyExists } from './errors/email-already-exists-error'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: CreateDeveloperUseCase

describe('Create developer Use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    sut = new CreateDeveloperUseCase(inMemoryDevelopersRepository)
  })

  it('should be able to create a new developer', async () => {
    const developer = makeDeveloper({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: developer.name,
      email: developer.email,
      password: developer.password,
      occupation_area: developer.occupation_area,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDevelopersRepository.items[0]).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('should not be able to create a new developer when email already exists', async () => {
    const developer = makeDeveloper({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      name: developer.name,
      email: developer.email,
      password: developer.password,
      occupation_area: developer.occupation_area,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExists)
  })
})
