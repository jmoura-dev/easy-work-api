import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeJob } from 'test/factories/make-job'
import { makeCompany } from 'test/factories/make-company'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchListJobsByCompanyUseCase } from './fetch-list-jobs-by-company'
import { makeUser } from 'test/factories/make-user'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryJobsRepository: InMemoryJobsRepository
let sut: FetchListJobsByCompanyUseCase

describe('Fetch list jobs by company Use case', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryJobsRepository = new InMemoryJobsRepository()

    sut = new FetchListJobsByCompanyUseCase(
      inMemoryJobsRepository,
      inMemoryCompaniesRepository,
    )
  })

  it('should be able to fetch list jobs', async () => {
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
    })

    const newCompany = makeCompany({
      userId: user.id,
    })
    inMemoryCompaniesRepository.create(company)
    inMemoryCompaniesRepository.create(newCompany)

    const job1 = makeJob({
      companyId: company.id,
      title: 'job-01',
    })

    const job2 = makeJob({
      companyId: company.id,
      title: 'job-02',
    })

    const job3 = makeJob({
      companyId: newCompany.id,
      title: 'job-02',
    })

    inMemoryJobsRepository.items.push(job1)
    inMemoryJobsRepository.items.push(job2)
    inMemoryJobsRepository.items.push(job3)

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      jobs: [
        expect.objectContaining({ title: 'job-01' }),
        expect.objectContaining({ title: 'job-02' }),
      ],
    })
  })

  it('should not be able to fetch list with invalid company', async () => {
    const result = await sut.execute({
      userId: 'Invalid user id',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
