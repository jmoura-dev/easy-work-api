import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { MockInstance } from 'vitest'
import {
  SendNotificationUseCaseRequest,
  SendNotificationUseCase,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { OnChangeStatus } from './on-change-status'
import { makeDeveloper } from 'test/factories/make-Developer'
import { makeCandidature } from 'test/factories/make-Candidature'
import { InMemoryCandidaturesRepository } from 'test/repositories/in-memory-Candidatures-repository'
import { waitFor } from 'test/utils/wait-for'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On change status', () => {
  beforeEach(() => {
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository()
    inMemoryCandidaturesRepository = new InMemoryCandidaturesRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnChangeStatus(sendNotificationUseCase, inMemoryDevelopersRepository)
  })

  it('should send a notification when the status changes', async () => {
    const developer = makeDeveloper()
    const candidature = makeCandidature({ developerId: developer.id })

    inMemoryDevelopersRepository.create(developer)
    inMemoryCandidaturesRepository.create(candidature)

    candidature.status = 'Entregue'

    inMemoryCandidaturesRepository.save(candidature)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  }, 10000)
})
