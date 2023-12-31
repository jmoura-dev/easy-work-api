import { Either, left, right } from '@/core/either'
import { CandidaturesRepository } from '../repositories/candidatures-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { JobsRepository } from '../repositories/jobs-repository'
import { DevelopersRepository } from '../repositories/developers-repository'
import { Candidature } from '../../enterprise/entities/candidature'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface CreateCandidatureUseCaseRequest {
  userId: string
  jobId: string
  status?: string
}

type CreateCandidatureUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class CreateCandidatureUseCase {
  constructor(
    private candidaturesRepository: CandidaturesRepository,
    private developersRepository: DevelopersRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    userId,
    jobId,
    status,
  }: CreateCandidatureUseCaseRequest): Promise<CreateCandidatureUseCaseResponse> {
    const developer = await this.developersRepository.findByUserId(userId)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    const job = await this.jobsRepository.findById(jobId)

    if (!job) {
      return left(new ResourceNotFoundError())
    }

    const candidature = Candidature.create({
      developerId: developer.id,
      jobId: new UniqueEntityID(jobId),
      status: status ?? 'Aguardando atualizações.',
    })

    await this.candidaturesRepository.create(candidature)

    return right(null)
  }
}
