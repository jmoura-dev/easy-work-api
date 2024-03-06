import { Either, left, right } from '@/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeveloperWithTechnologies } from '../../enterprise/entities/value-objects/developer-with-technologies'
import { DevelopersRepository } from '../repositories/developers-repository'
import { Injectable } from '@nestjs/common'

interface GetDeveloperDetailsUseCaseRequest {
  userId: string
}

type GetDeveloperDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    developerWithDetails: DeveloperWithTechnologies
  }
>

@Injectable()
export class GetDeveloperDetailsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private developersRepository: DevelopersRepository,
  ) {}

  async execute({
    userId,
  }: GetDeveloperDetailsUseCaseRequest): Promise<GetDeveloperDetailsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const developer = await this.developersRepository.findByUserId(
      user.id.toString(),
    )

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    const developerWithDetails =
      await this.developersRepository.findDetailsById(developer.id.toString())

    if (!developerWithDetails) {
      return left(new ResourceNotFoundError())
    }

    return right({
      developerWithDetails,
    })
  }
}
