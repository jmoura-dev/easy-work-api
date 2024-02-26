import { Either, left, right } from '@/core/either'
import { JobsRepository } from '../repositories/jobs-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CompaniesRepository } from '../repositories/companies-repository'
import { Job } from '../../enterprise/entities/job'
import { Injectable } from '@nestjs/common'

interface CreateJobUseCaseRequest {
  userId: string
  title: string
  description: string
  workMode: string
  workSchedule: string
  remuneration: number
  hoursPerWeek: number
}

type CreateJobUseCaseResponse = Either<NotAllowedError, null>

@Injectable()
export class CreateJobUseCase {
  constructor(
    private jobsRepository: JobsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    userId,
    title,
    description,
    workMode,
    workSchedule,
    remuneration,
    hoursPerWeek,
  }: CreateJobUseCaseRequest): Promise<CreateJobUseCaseResponse> {
    const company = await this.companiesRepository.findByUserId(userId)

    if (!company) {
      return left(new NotAllowedError())
    }

    const job = Job.create({
      companyId: company.id,
      title,
      description,
      workMode,
      workSchedule,
      remuneration,
      hoursPerWeek,
    })

    await this.jobsRepository.create(job)

    return right(null)
  }
}
