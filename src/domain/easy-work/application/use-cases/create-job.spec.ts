import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { CreateJobUseCase } from './create-job'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeCompany } from 'test/factories/make-company'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeUser } from 'test/factories/make-user'

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
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: user.id.toString(),
      title: 'new job title',
      description: 'new job description',
      workMode: 'remoto',
      workSchedule: 'tempo integral',
      remuneration: 1500,
      hoursPerWeek: 40,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryJobsRepository.items[0].title).toEqual('new job title')
  })

  it('should not be able to create a new job with invalid company', async () => {
    const user = makeUser()
    const company = makeCompany({
      userId: user.id,
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      userId: 'Invalid-company-id',
      title: 'new job',
      description: 'new job description',
      workMode: 'remoto',
      workSchedule: 'tempo integral',
      remuneration: 1500,
      hoursPerWeek: 40,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
