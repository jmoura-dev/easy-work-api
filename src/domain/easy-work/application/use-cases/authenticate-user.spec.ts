import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { FakeHasher } from 'test/cryptograph/fake-hasher'
import { FakeEncrypter } from 'test/cryptograph/fake-encrypter'
import { makeUser } from 'test/factories/make-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository

let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

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

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeEncrypter,
      fakeHasher,
    )
  })

  it('should be able to authenticate user', async () => {
    const user = makeUser({
      email: 'user@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'user@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate user with invalid email', async () => {
    const user = makeUser({
      email: 'user@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'invalid-email',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
