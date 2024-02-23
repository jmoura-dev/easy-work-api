import { InMemoryJobsRepository } from 'test/repositories/in-memory-jobs-repository'
import { makeJob } from 'test/factories/make-job'
import { GetAllJobsUseCase } from './get-list-all-jobs'

let inMemoryJobsRepository: InMemoryJobsRepository
let sut: GetAllJobsUseCase

describe('Get all jobs', () => {
  beforeEach(() => {
    inMemoryJobsRepository = new InMemoryJobsRepository()
    sut = new GetAllJobsUseCase(inMemoryJobsRepository)
  })

  it('should be able to get list with all jobs', async () => {
    for (let i = 0; i < 10; i++) {
      const newJob = makeJob()
      inMemoryJobsRepository.items.push(newJob)
    }

    const result = await sut.execute({
      page: 1,
    })

    expect(result.jobs.length).toEqual(10)
  })

  it('should be able to get list with all jobs by number page', async () => {
    for (let i = 0; i < 22; i++) {
      const newJob = makeJob()
      inMemoryJobsRepository.items.push(newJob)
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.jobs.length).toEqual(2)
    console.log(result.jobs)
  })
})
