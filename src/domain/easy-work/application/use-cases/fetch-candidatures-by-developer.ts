import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DevelopersRepository } from '../repositories/developers-repository'
import { CandidaturesRepository } from '../repositories/candidatures-repository'
import { Injectable } from '@nestjs/common'
import { CandidatureWithJobAndCompany } from '../../enterprise/entities/value-objects/candidature-with-job-and-company'

interface FetchCandidaturesByDeveloperUseCaseRequest {
  userId: string
  page: number
}

type FetchCandidaturesByDeveloperUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    candidatures: CandidatureWithJobAndCompany[]
  }
>

@Injectable()
export class FetchCandidaturesByDeveloperUseCase {
  constructor(
    private developersRepository: DevelopersRepository,
    private candidaturesRepository: CandidaturesRepository,
  ) {}

  async execute({
    userId,
    page,
  }: FetchCandidaturesByDeveloperUseCaseRequest): Promise<FetchCandidaturesByDeveloperUseCaseResponse> {
    const developer = await this.developersRepository.findByUserId(userId)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    const candidatures =
      await this.candidaturesRepository.findManyByDeveloperId(
        {
          page,
        },
        developer.id.toString(),
      )

    return right({
      candidatures,
    })
  }
}
