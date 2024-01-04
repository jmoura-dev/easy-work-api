import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { GetJobDetailsByIdUseCase } from './get-job-details-by-id'
import { makeJob } from 'test/factories/make-job'

let inMemoryJobsRepository: InMemoryJobsRepository
let sut: GetJobDetailsByIdUseCase

describe('Get job details by id', () => {
  beforeEach(() => {
    inMemoryJobsRepository = new InMemoryJobsRepository()
    sut = new GetJobDetailsByIdUseCase(inMemoryJobsRepository)
  })

  it('should be able to get details job by id', async () => {
    const job = makeJob({
      title: 'Vaga desenvolvedor Frontend',
      description: 'Vaga desenvolvedor Frontend description',
    })

    inMemoryJobsRepository.items.push(job)

    const result = await sut.execute({
      jobId: job.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      job: expect.objectContaining({
        title: 'Vaga desenvolvedor Frontend',
        description: 'Vaga desenvolvedor Frontend description',
      }),
    })
  })
})
