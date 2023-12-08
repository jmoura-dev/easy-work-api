import { Either, left, right } from '@/core/either'
import { CandidaturesRepository } from '../repositories/candidatures-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Candidature } from '../../enterprise/entities/candidature'
import { CompaniesRepository } from '../repositories/companies-repository'

interface UpdateStatusCandidatureUseCaseRequest {
  companyId: string
  candidatureId: string
  status: string
}

type UpdateStatusCandidatureUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    candidature: Candidature
  }
>

export class UpdateStatusCandidatureUseCase {
  constructor(
    private candidaturesRepository: CandidaturesRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    companyId,
    candidatureId,
    status,
  }: UpdateStatusCandidatureUseCaseRequest): Promise<UpdateStatusCandidatureUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    const candidature =
      await this.candidaturesRepository.findById(candidatureId)

    if (!candidature) {
      return left(new ResourceNotFoundError())
    }

    candidature.status = status ?? candidature.status

    await this.candidaturesRepository.save(candidature)

    return right({
      candidature,
    })
  }
}
