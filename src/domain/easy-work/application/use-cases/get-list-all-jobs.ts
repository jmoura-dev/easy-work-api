import { JobsRepository } from '../repositories/jobs-repository'
import { Injectable } from '@nestjs/common'
import { JobWithCompany } from '../../enterprise/entities/value-objects/job-with-company'

interface GetAllJobsUseCaseRequest {
  page: number
}

interface GetAllJobsUseCaseResponse {
  jobsWithCompany: JobWithCompany[]
}

@Injectable()
export class GetAllJobsUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    page,
  }: GetAllJobsUseCaseRequest): Promise<GetAllJobsUseCaseResponse> {
    const jobsWithCompany = await this.jobsRepository.findMany({ page })

    return {
      jobsWithCompany,
    }
  }
}
