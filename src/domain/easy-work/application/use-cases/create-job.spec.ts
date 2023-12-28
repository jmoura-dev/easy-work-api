import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { CreateJobUseCase } from './create-job'
import { makeJob } from 'test/factories/make-job'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryJobsRepository: InMemoryJobsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: CreateJobUseCase

describe('Create job Use case', () => {
  beforeEach(() => {
    inMemoryJobsRepository = new InMemoryJobsRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new CreateJobUseCase(
      inMemoryJobsRepository,
      inMemoryCompaniesRepository,
    )
  })

  it('should be able to create a new job', async () => {
    const company = makeCompany()

    inMemoryCompaniesRepository.items.push(company)
    const companyId = company.id.toString()

    const job = makeJob({
      companyId: company.id,
      title: 'new job',
    })

    const result = await sut.execute({
      companyId,
      title: job.title,
      description: job.description,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryJobsRepository.items[0].title).toEqual('new job')
  })

  it('should not be able to create a new job with invalid company id', async () => {
    const company = makeCompany({}, new UniqueEntityID('company-id'))

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      companyId: 'Invalid-company-id',
      title: 'new job',
      description: 'new job description',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
