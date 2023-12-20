import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHasher } from 'test/cryptograph/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { EmailAlreadyExists } from './errors/email-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase
let fakeHasher: FakeHasher

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      name: 'John doe',
      email: 'foo@example.com',
      password: '12312312',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0]).toMatchObject({
      name: 'John doe',
      email: 'foo@example.com',
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John doe',
      email: 'foo@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create a new user when the email already exists ', async () => {
    const user = makeUser({
      email: 'foo@example.com',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      name: 'John doe',
      email: 'foo@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExists)
  })
})
