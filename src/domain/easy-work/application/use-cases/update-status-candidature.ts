import { Either, left, right } from '@/core/either'
import { CandidaturesRepository } from '../repositories/candidatures-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Candidature } from '../../enterprise/entities/candidature'
import { CompaniesRepository } from '../repositories/companies-repository'
import { Injectable } from '@nestjs/common'

interface UpdateStatusCandidatureUseCaseRequest {
  userId: string
  candidatureId: string
  status: string
}

type UpdateStatusCandidatureUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    candidature: Candidature
  }
>

@Injectable()
export class UpdateStatusCandidatureUseCase {
  constructor(
    private candidaturesRepository: CandidaturesRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    userId,
    candidatureId,
    status,
  }: UpdateStatusCandidatureUseCaseRequest): Promise<UpdateStatusCandidatureUseCaseResponse> {
    const company = await this.companiesRepository.findByUserId(userId)

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
