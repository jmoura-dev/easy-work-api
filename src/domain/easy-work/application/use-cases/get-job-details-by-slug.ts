import { Either, left, right } from '@/core/either'
import { JobsRepository } from '../repositories/jobs-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Job } from '../../enterprise/entities/job'
import { Injectable } from '@nestjs/common'

interface GetJobDetailsBySlugUseCaseRequest {
  slug: string
}

type GetJobDetailsBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    job: Job
  }
>

@Injectable()
export class GetJobDetailsBySlugUseCase {
  constructor(private jobsRepository: JobsRepository) {}

  async execute({
    slug,
  }: GetJobDetailsBySlugUseCaseRequest): Promise<GetJobDetailsBySlugUseCaseResponse> {
    const job = await this.jobsRepository.findBySlug(slug)

    if (!job) {
      return left(new ResourceNotFoundError())
    }

    return right({
      job,
    })
  }
}
