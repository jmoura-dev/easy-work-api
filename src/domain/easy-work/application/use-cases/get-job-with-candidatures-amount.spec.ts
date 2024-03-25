import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeJob } from 'test/factories/make-job'
import { GetJobWithCandidaturesAmountUseCase } from './get-job-with-candidatures-amount'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryDevelopersRepository } from 'test/repositories/in-memory-developers-repository'
import { InMemoryDeveloperTechnologiesRepository } from 'test/repositories/in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from 'test/repositories/in-memory-technologies-repository'
import { makeUser } from 'test/factories/make-user'
import { makeCompany } from 'test/factories/make-company'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDevelopersRepository: InMemoryDevelopersRepository
let inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository
let inMemoryTechnologiesRepository: InMemoryTechnologiesRepository

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryJobsRepository: InMemoryJobsRepository
let sut: GetJobWithCandidaturesAmountUseCase

describe('Get job with candidatures amount', () => {
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
    inMemoryJobsRepository = new InMemoryJobsRepository()

    sut = new GetJobWithCandidaturesAmountUseCase(
      inMemoryUsersRepository,
      inMemoryCompaniesRepository,
      inMemoryJobsRepository,
    )
  })

  it('should be able to get jobs with candidatures amount', async () => {
    const user = makeUser()
    const company = makeCompany({ userId: user.id })

    inMemoryUsersRepository.items.push(user)
    inMemoryCompaniesRepository.items.push(company)

    const job = makeJob({
      companyId: company.id,
      title: 'Vaga desenvolvedor Frontend',
      description: 'Vaga desenvolvedor Frontend description',
      remuneration: 15,
    })

    inMemoryJobsRepository.items.push(job)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      jobs: [
        expect.objectContaining({
          jobId: job.id,
          title: 'Vaga desenvolvedor Frontend',
          description: 'Vaga desenvolvedor Frontend description',
          remuneration: 15,
          amountCandidatures: 3,
        }),
      ],
    })
  })

  it('should not be able to get jobs with invalid ID', async () => {
    const user = makeUser()
    const company = makeCompany({ userId: user.id })

    inMemoryUsersRepository.items.push(user)
    inMemoryCompaniesRepository.items.push(company)

    const job = makeJob({
      companyId: company.id,
      title: 'Vaga desenvolvedor Frontend',
      description: 'Vaga desenvolvedor Frontend description',
      remuneration: 15,
    })

    inMemoryJobsRepository.items.push(job)

    const result = await sut.execute({
      userId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
