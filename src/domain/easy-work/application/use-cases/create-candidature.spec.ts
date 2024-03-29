import { InMemoryCandidaturesRepository } from 'test/repositories/in-memory-candidatures-repository'
import { CreateCandidatureUseCase } from './create-candidature'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeDeveloper } from 'test/factories/make-developer'
import { makeJob } from 'test/factories/make-job'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeUser } from 'test/factories/make-user'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository

let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository
let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryJobsRepository: InMemoryJobsRepository
let sut: CreateCandidatureUseCase

describe('Create candidature Use case', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryDevelopersRepository,
      inMemoryCompaniesRepository,
    )
    inMemoryTechnologiesRepository = new InMemoryTechnologiesRepository()
    inMemoryDeveloperTechnologiesRepository =
      new InMemoryDeveloperTechnologiesRepository(
        inMemoryTechnologiesRepository,
      )

    inMemoryCandidaturesRepository = new InMemoryCandidaturesRepository()
    inMemoryDevelopersRepository = new InMemoryDevelopersRepository(
      inMemoryUsersRepository,
      inMemoryDeveloperTechnologiesRepository,
      inMemoryTechnologiesRepository,
    )
    inMemoryJobsRepository = new InMemoryJobsRepository()

    sut = new CreateCandidatureUseCase(
      inMemoryCandidaturesRepository,
      inMemoryDevelopersRepository,
      inMemoryJobsRepository,
    )
  })

  it('should be able to create a new candidature', async () => {
    const user = makeUser()
    const developer = makeDeveloper({
      userId: user.id,
    })
    const job = makeJob()

    const jobId = job.id.toString()

    inMemoryDevelopersRepository.create(developer)
    inMemoryJobsRepository.create(job)

    const result = await sut.execute({
      userId: user.id.toString(),
      jobId,
      status: 'Candidature completed successfully',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCandidaturesRepository.items[0].status).toEqual(
      'Candidature completed successfully',
    )
  })

  it('should not be able to create a new candidature with invalid developerId', async () => {
    const user = makeUser()
    const developer = makeDeveloper(
      {
        userId: user.id,
      },
      new UniqueEntityID('developer-01'),
    )
    const job = makeJob()

    const jobId = job.id.toString()

    inMemoryDevelopersRepository.create(developer)
    inMemoryJobsRepository.create(job)

    const result = await sut.execute({
      userId: 'Invalid-developer-id',
      jobId,
      status: 'Candidature completed successfully',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a new candidature with invalid jobId', async () => {
    const user = makeUser()
    const developer = makeDeveloper({
      userId: user.id,
    })
    const job = makeJob({}, new UniqueEntityID('job-01'))

    inMemoryDevelopersRepository.create(developer)
    inMemoryJobsRepository.create(job)

    const result = await sut.execute({
      userId: user.id.toString(),
      jobId: 'Invalid-developer-id',
      status: 'Candidature completed successfully',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
