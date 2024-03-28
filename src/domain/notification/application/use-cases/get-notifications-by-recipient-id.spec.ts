import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { GetNotificationsUseCase } from './get-notifications-by-recipient-id'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let sut: GetNotificationsUseCase

describe('Get notifications Use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
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

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new GetNotificationsUseCase(
      inMemoryNotificationsRepository,
      inMemoryDevelopersRepository,
    )
  })

  it('should be able to get all notifications by recipient ID', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const developer = makeDeveloper({
      userId: user.id,
    })
    inMemoryDevelopersRepository.items.push(developer)

    const notification = makeNotification({
      title: 'New notification',
      developerId: developer.id,
    })
    const notification01 = makeNotification({
      title: 'New notification-01',
      developerId: developer.id,
    })

    inMemoryNotificationsRepository.items.push(notification)
    inMemoryNotificationsRepository.items.push(notification01)

    const result = await sut.execute({
      recipientId: user.id.toString(),
    })

    console.log(result.value)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      notifications: [
        expect.objectContaining({
          title: 'New notification',
        }),
        expect.objectContaining({
          title: 'New notification-01',
        }),
      ],
    })
  })

  it('should not be able to get notifications with invalid recipient-ID', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const developer = makeDeveloper({
      userId: user.id,
    })
    inMemoryDevelopersRepository.items.push(developer)

    const notification = makeNotification({
      title: 'New notification',
      developerId: developer.id,
    })
    const notification01 = makeNotification({
      title: 'New notification-01',
      developerId: developer.id,
    })

    inMemoryNotificationsRepository.items.push(notification)
    inMemoryNotificationsRepository.items.push(notification01)

    const result = await sut.execute({
      recipientId: 'invalid-recipient-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
