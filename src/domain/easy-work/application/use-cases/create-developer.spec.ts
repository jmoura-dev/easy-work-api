import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { CreateDeveloperUseCase } from './create-developer'
import { makeDeveloper } from 'test/factories/make-developer'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateDeveloperUseCase

describe('Create developer Use case', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new CreateDeveloperUseCase(
      inMemoryDevelopersRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to create a new developer', async () => {
    const user = makeUser()

    inMemoryUsersRepository.items.push(user)

    const developer = makeDeveloper({
      userId: user.id,
      occupation_area: 'Backend',
    })

    const result = await sut.execute({
      userId: developer.userId.toString(),
      occupation_area: developer.occupation_area,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDevelopersRepository.items[0]).toMatchObject({
      occupation_area: 'Backend',
    })
  })

  it('should not be able to create a new developer when user do not exists', async () => {
    const developer = makeDeveloper({
      userId: new UniqueEntityID('user-01'),
    })

    inMemoryDevelopersRepository.items.push(developer)

    const result = await sut.execute({
      userId: 'invalid-user',
      occupation_area: developer.occupation_area,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
