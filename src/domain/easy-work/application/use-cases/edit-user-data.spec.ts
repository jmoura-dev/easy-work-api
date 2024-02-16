import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { EditUserDataUseCase } from './edit-user-data'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FakeHasher } from 'test/cryptograph/fake-hasher'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'

let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: EditUserDataUseCase

describe('Edit user data Use case', () => {
  beforeEach(() => {
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
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
    fakeHasher = new FakeHasher()
    sut = new EditUserDataUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able update users data', async () => {
    const user = makeUser({
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      password: await fakeHasher.hash('123456'),
      about: 'Developer freelancer',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: '123456',
      newPassword: '654321',
      about: 'Developer at fake company',
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryUsersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Smith',
        email: 'john.smith@gmail.com',
        password: '654321-hashed',
        about: 'Developer at fake company',
      }),
    )
  })

  it('should not be able update users data with invalid old password', async () => {
    const user = makeUser({
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      password: await fakeHasher.hash('123456'),
      about: 'Developer freelancer',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: '1234567',
      newPassword: '654321',
      about: 'Developer at fake company',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to update users data with invalid id', async () => {
    const user = makeUser({}, new UniqueEntityID('user-01'))

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: 'invalid-user-id',
      name: 'John Smith',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
