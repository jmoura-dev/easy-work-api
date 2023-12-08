import { Either, left, right } from '@/core/either'
import { DevelopersRepository } from '../repositories/developers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeveloperTechnologiesRepository } from '../repositories/developer-technologies-repository'
import { Technology } from '../../enterprise/entities/technology'

interface FetchListTechnologiesByDeveloperUseCaseRequest {
  developerId: string
}

type FetchListTechnologiesByDeveloperUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    technologies: Technology[]
  }
>

export class FetchListTechnologiesByDeveloperUseCase {
  constructor(
    private developerTechnologiesRepository: DeveloperTechnologiesRepository,
    private developersRepository: DevelopersRepository,
  ) {}

  async execute({
    developerId,
  }: FetchListTechnologiesByDeveloperUseCaseRequest): Promise<FetchListTechnologiesByDeveloperUseCaseResponse> {
    const doesDeveloperExists =
      await this.developersRepository.findById(developerId)

    if (!doesDeveloperExists) {
      return left(new ResourceNotFoundError())
    }

    const technologies =
      await this.developerTechnologiesRepository.findManyByDeveloperId(
        developerId,
      )

    return right({
      technologies,
    })
  }
}
