import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { FetchCandidaturesByDeveloperUseCase } from './fetch-candidatures-by-developer'
import { InMemoryCandidaturesRepository } from 'test/repositories/in-memory-candidatures-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { makeCandidature } from 'test/factories/make-candidature'
import { makeJob } from 'test/factories/make-job'
import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeUser } from 'test/factories/make-user'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository
let inMemoryJobsRepository: InMemoryJobsRepository

let sut: FetchCandidaturesByDeveloperUseCase

describe('Fetch candidatures by developer', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
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

    sut = new FetchCandidaturesByDeveloperUseCase(
      inMemoryDevelopersRepository,
      inMemoryCandidaturesRepository,
    )
  })

  it('should be able to fetch a list of candidatures by developer', async () => {
    const user = makeUser()
    const developer = makeDeveloper({
      userId: user.id,
    })
    inMemoryDevelopersRepository.items.push(developer)

    const job01 = makeJob({
      title: 'Job 01',
    })

    const job02 = makeJob({
      title: 'Job 02',
    })

    inMemoryJobsRepository.items.push(job01)
    inMemoryJobsRepository.items.push(job02)

    const candidature01 = makeCandidature({
      developerId: developer.id,
      jobId: job01.id,
      status: 'Candidatura 01',
    })

    const candidature02 = makeCandidature({
      developerId: developer.id,
      jobId: job02.id,
      status: 'Candidatura 05',
    })
    inMemoryCandidaturesRepository.items.push(candidature01)
    inMemoryCandidaturesRepository.items.push(candidature02)

    const result = await sut.execute({
      page: 1,
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      candidatures: [
        expect.objectContaining({
          status: 'Candidatura 01',
        }),
        expect.objectContaining({
          status: 'Candidatura 05',
        }),
      ],
    })
  })

  it('should not be able to fetch candidatures within developer invalid', async () => {
    const job01 = makeJob({
      title: 'Job 01',
    })

    inMemoryJobsRepository.items.push(job01)

    const candidature01 = makeCandidature({
      jobId: job01.id,
      status: 'Candidatura 01',
    })

    inMemoryCandidaturesRepository.items.push(candidature01)

    const result = await sut.execute({
      page: 1,
      userId: 'user invalid id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
