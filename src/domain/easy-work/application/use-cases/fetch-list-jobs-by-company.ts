import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { JobsRepository } from '../repositories/jobs-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Job } from '../../enterprise/entities/job'

interface FetchListJobsByCompanyRequest {
  companyId: string
  page: number
}

type FetchListJobsByCompanyResponse = Either<
  ResourceNotFoundError,
  {
    jobs: Job[]
  }
>

export class FetchListJobsByCompany {
  constructor(
    private jobsRepository: JobsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    companyId,
    page,
  }: FetchListJobsByCompanyRequest): Promise<FetchListJobsByCompanyResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    const jobs = await this.jobsRepository.findManyByCompanyId(
      { page },
      companyId,
    )

    return right({
      jobs,
    })
  }
}
