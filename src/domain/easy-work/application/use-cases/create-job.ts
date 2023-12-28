import { Either, left, right } from '@/core/either'
import { JobsRepository } from '../repositories/jobs-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CompaniesRepository } from '../repositories/companies-repository'
import { Job } from '../../enterprise/entities/job'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateJobUseCaseRequest {
  companyId: string
  title: string
  description: string
}

type CreateJobUseCaseResponse = Either<NotAllowedError, null>

export class CreateJobUseCase {
  constructor(
    private jobsRepository: JobsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    companyId,
    title,
    description,
  }: CreateJobUseCaseRequest): Promise<CreateJobUseCaseResponse> {
    const checkCompanyExists =
      await this.companiesRepository.findById(companyId)

    if (!checkCompanyExists) {
      return left(new NotAllowedError())
    }

    const job = Job.create({
      companyId: new UniqueEntityID(companyId),
      title,
      description,
    })

    await this.jobsRepository.create(job)

    return right(null)
  }
}
