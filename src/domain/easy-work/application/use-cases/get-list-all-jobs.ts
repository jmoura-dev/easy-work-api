import { JobsRepository } from '../repositories/jobs-repository'
import { Job } from '../../enterprise/entities/job'
import { Injectable } from '@nestjs/common'

interface GetAllJobsUseCaseRequest {
  page: number
}

interface GetAllJobsUseCaseResponse {
  jobs: Job[]
}

@Injectable()
export class GetAllJobsUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    page,
  }: GetAllJobsUseCaseRequest): Promise<GetAllJobsUseCaseResponse> {
    const jobs = await this.jobsRepository.findMany({ page })

    return {
      jobs,
    }
  }
}
