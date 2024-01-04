import { Either, left, right } from '@/core/either'
import { DevelopersRepository } from '../repositories/developers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeveloperTechnologiesRepository } from '../repositories/developer-technologies-repository'
import { Technology } from '../../enterprise/entities/technology'
import { Injectable } from '@nestjs/common'

interface FetchListTechnologiesByDeveloperUseCaseRequest {
  userId: string
}

type FetchListTechnologiesByDeveloperUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    technologies: Technology[]
  }
>

@Injectable()
export class FetchListTechnologiesByDeveloperUseCase {
  constructor(
    private developerTechnologiesRepository: DeveloperTechnologiesRepository,
    private developersRepository: DevelopersRepository,
  ) {}

  async execute({
    userId,
  }: FetchListTechnologiesByDeveloperUseCaseRequest): Promise<FetchListTechnologiesByDeveloperUseCaseResponse> {
    const developer = await this.developersRepository.findByUserId(userId)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    const technologies =
      await this.developerTechnologiesRepository.findManyByDeveloperId(
        developer.id.toString(),
      )

    return right({
      technologies,
    })
  }
}
