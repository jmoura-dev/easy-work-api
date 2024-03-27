import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Candidature } from '../../enterprise/entities/candidature'
import { CandidaturesRepository } from '../repositories/candidatures-repository'

interface GetCandidatureByIdUseCaseRequest {
  candidatureId: string
}

type GetCandidatureByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    candidature: Candidature
  }
>

@Injectable()
export class GetCandidatureByIdUseCase {
  constructor(private candidaturesRepository: CandidaturesRepository) {}

  async execute({
    candidatureId,
  }: GetCandidatureByIdUseCaseRequest): Promise<GetCandidatureByIdUseCaseResponse> {
    const candidature =
      await this.candidaturesRepository.findById(candidatureId)

    if (!candidature) {
      return left(new ResourceNotFoundError())
    }

    return right({
      candidature,
    })
  }
}
