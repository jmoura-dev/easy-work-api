import { Either, left, right } from '@/core/either'
import { CandidaturesRepository } from '../repositories/candidatures-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { JobsRepository } from '../repositories/jobs-repository'
import { DevelopersRepository } from '../repositories/developers-repository'
import { Candidature } from '../../enterprise/entities/candidature'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateCandidatureUseCaseRequest {
  developerId: string
  jobId: string
  status: string
}

type CreateCandidatureUseCaseResponse = Either<ResourceNotFoundError, null>

export class CreateCandidatureUseCase {
  constructor(
    private candidaturesRepository: CandidaturesRepository,
    private developersRepository: DevelopersRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    developerId,
    jobId,
    status,
  }: CreateCandidatureUseCaseRequest): Promise<CreateCandidatureUseCaseResponse> {
    const developer = await this.developersRepository.findById(developerId)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    const job = await this.jobsRepository.findById(jobId)

    if (!job) {
      return left(new ResourceNotFoundError())
    }

    const candidature = Candidature.create({
      developerId: new UniqueEntityID(developerId),
      jobId: new UniqueEntityID(jobId),
      status,
    })

    await this.candidaturesRepository.create(candidature)

    return right(null)
  }
}
