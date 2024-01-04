import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeJob } from 'test/factories/make-job'
import { GetJobDetailsBySlugUseCase } from './get-job-details-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryJobsRepository: InMemoryJobsRepository
let sut: GetJobDetailsBySlugUseCase

describe('Get job details by slug', () => {
  beforeEach(() => {
    inMemoryJobsRepository = new InMemoryJobsRepository()
    sut = new GetJobDetailsBySlugUseCase(inMemoryJobsRepository)
  })

  it('should be able to get details job by slug', async () => {
    const job = makeJob({
      title: 'Vaga desenvolvedor Backend',
      slug: Slug.createFromText('Vaga desenvolvedor Backend'),
      description: 'Vaga desenvolvedor Backend description',
    })

    inMemoryJobsRepository.items.push(job)

    const result = await sut.execute({
      slug: 'vaga-desenvolvedor-backend',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      job: expect.objectContaining({
        title: 'Vaga desenvolvedor Backend',
        description: 'Vaga desenvolvedor Backend description',
      }),
    })
  })

  it('should not be able to get job within invalid job', async () => {
    const job = makeJob({
      title: 'Vaga desenvolvedor Backend',
      slug: Slug.createFromText('Vaga desenvolvedor Backend'),
      description: 'Vaga desenvolvedor Backend description',
    })

    inMemoryJobsRepository.items.push(job)

    const result = await sut.execute({
      slug: 'invalid-slug',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
