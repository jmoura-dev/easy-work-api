import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Job } from '../../enterprise/entities/job'
import { JobsRepository } from '../repositories/jobs-repository'

interface GetJobDetailsByIdUseCaseRequest {
  jobId: string
}

type GetJobDetailsByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    job: Job
  }
>

@Injectable()
export class GetJobDetailsByIdUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    jobId,
  }: GetJobDetailsByIdUseCaseRequest): Promise<GetJobDetailsByIdUseCaseResponse> {
    const job = await this.jobsRepository.findById(jobId)

    if (!job) {
      return left(new ResourceNotFoundError())
    }

    return right({
      job,
    })
  }
}
