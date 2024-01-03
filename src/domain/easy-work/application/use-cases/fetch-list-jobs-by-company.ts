import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { JobsRepository } from '../repositories/jobs-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Job } from '../../enterprise/entities/job'
import { Injectable } from '@nestjs/common'

interface FetchListJobsByCompanyUseCaseRequest {
  userId: string
  page: number
}

type FetchListJobsByCompanyUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    jobs: Job[]
  }
>

@Injectable()
export class FetchListJobsByCompanyUseCase {
  constructor(
    private jobsRepository: JobsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    userId,
    page,
  }: FetchListJobsByCompanyUseCaseRequest): Promise<FetchListJobsByCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findByUserId(userId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    const jobs = await this.jobsRepository.findManyByCompanyId(
      { page },
      company.id.toString(),
    )

    return right({
      jobs,
    })
  }
}
