import { Either, left, right } from '@/core/either'
import { JobsRepository } from '../repositories/jobs-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Candidature } from '../../enterprise/entities/candidature'
import { CandidaturesRepository } from '../repositories/candidatures-repository'

interface FetchListCandidaturesByJobUseCaseRequest {
  companyId: string
  jobId: string
  page: number
}

type FetchListCandidaturesByJobUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    candidatures: Candidature[]
  }
>

export class FetchListCandidaturesByJobUseCase {
  constructor(
    private candidaturesRepository: CandidaturesRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    companyId,
    jobId,
    page,
  }: FetchListCandidaturesByJobUseCaseRequest): Promise<FetchListCandidaturesByJobUseCaseResponse> {
    const job = await this.jobsRepository.findById(jobId)

    if (!job) {
      return left(new ResourceNotFoundError())
    }

    if (job.companyId.toString() !== companyId) {
      return left(new ResourceNotFoundError())
    }

    const candidatures = await this.candidaturesRepository.findManyByJobId(
      { page },
      jobId,
    )

    return right({
      candidatures,
    })
  }
}
