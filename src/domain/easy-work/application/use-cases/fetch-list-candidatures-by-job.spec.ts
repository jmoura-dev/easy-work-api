import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeJob } from 'test/factories/make-job'
import { makeCompany } from 'test/factories/make-company'
import { FetchListCandidaturesByJobUseCase } from './fetch-list-candidatures-by-job'
import { InMemoryCandidaturesRepository } from 'test/repositories/in-memory-candidatures-repository'
import { makeCandidature } from 'test/factories/make-candidature'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository

let inMemoryJobsRepository: InMemoryJobsRepository
let inMemoryCandidaturesRepository: InMemoryCandidaturesRepository
let sut: FetchListCandidaturesByJobUseCase

describe('Fetch list candidatures by job Use case', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

    inMemoryJobsRepository = new InMemoryJobsRepository()
    inMemoryCandidaturesRepository = new InMemoryCandidaturesRepository()
    sut = new FetchListCandidaturesByJobUseCase(
      inMemoryCandidaturesRepository,
      inMemoryJobsRepository,
    )
  })

  it('should be able to fetch list candidatures', async () => {
    const company = makeCompany()
    inMemoryCompaniesRepository.create(company)

    const job = makeJob({
      companyId: company.id,
    })

    inMemoryJobsRepository.items.push(job)
    const jobId = job.id.toString()

    const candidature01 = makeCandidature({
      jobId: job.id,
      status: 'candidature-01',
    })

    const candidature02 = makeCandidature({
      jobId: job.id,
      status: 'candidature-02',
    })

    inMemoryCandidaturesRepository.create(candidature01)
    inMemoryCandidaturesRepository.create(candidature02)

    const result = await sut.execute({
      jobId,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      candidatures: [
        expect.objectContaining({ status: 'candidature-01' }),
        expect.objectContaining({ status: 'candidature-02' }),
      ],
    })
  })

  it('should not be able to fetch list with invalid job', async () => {
    const company = makeCompany()
    inMemoryCompaniesRepository.create(company)

    const job = makeJob({
      companyId: company.id,
    })

    inMemoryJobsRepository.items.push(job)

    const candidature01 = makeCandidature({
      jobId: job.id,
      status: 'candidature-01',
    })

    inMemoryCandidaturesRepository.create(candidature01)

    const result = await sut.execute({
      jobId: 'Invalid job id',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
