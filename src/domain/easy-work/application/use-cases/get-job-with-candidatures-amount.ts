import { Either, left, right } from '@/core/either'
import { JobWithCandidaturesAmount } from '../../enterprise/entities/value-objects/job-with-candidatures-amount'
import { CompaniesRepository } from '../repositories/companies-repository'
import { JobsRepository } from '../repositories/jobs-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetJobWithCandidaturesAmountRequest {
  userId: string
}

type GetJobWithCandidaturesAmountResponse = Either<
  ResourceNotFoundError,
  {
    jobs: JobWithCandidaturesAmount[]
  }
>

@Injectable()
export class GetJobWithCandidaturesAmountUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    userId,
  }: GetJobWithCandidaturesAmountRequest): Promise<GetJobWithCandidaturesAmountResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const company = await this.companiesRepository.findByUserId(
      user.id.toString(),
    )

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    const companyId = company.id.toString()

    const jobs =
      await this.jobsRepository.findManyWithCandidaturesAmount(companyId)

    return right({
      jobs,
    })
  }
}
