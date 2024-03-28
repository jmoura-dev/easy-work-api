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
import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeJob } from 'test/factories/make-job'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository
let inMemoryJobsRepository: InMemoryJobsRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On change status', () => {
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
    inMemoryCandidaturesRepository = new InMemoryCandidaturesRepository()
    inMemoryJobsRepository = new InMemoryJobsRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnChangeStatus(
      sendNotificationUseCase,
      inMemoryDevelopersRepository,
      inMemoryJobsRepository,
    )
  })

  it('should send a notification when the status changes', async () => {
    const job = makeJob()
    inMemoryJobsRepository.create(job)

    const developer = makeDeveloper()
    inMemoryDevelopersRepository.create(developer)

    const candidature = makeCandidature({
      jobId: job.id,
      developerId: developer.id,
      status: 'Aguardando atualizações',
    })
    inMemoryCandidaturesRepository.create(candidature)

    candidature.status = 'Aprovado'

    inMemoryCandidaturesRepository.save(candidature)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  }, 10000)
})
