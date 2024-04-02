import { Either, left, right } from '@/core/either'
import { DevelopersRepository } from '../repositories/developers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Developer } from '../../enterprise/entities/user-developer'
import { Injectable } from '@nestjs/common'

interface EditDeveloperDataUseCaseRequest {
  userId: string
  price_per_hour?: number
  occupation_area?: string
  available_for_contract?: boolean
  linkedin?: string
  github?: string
  portfolio?: string
}

type EditDeveloperDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    developer: Developer
  }
>

@Injectable()
export class EditDeveloperDataUseCase {
  constructor(private developersRepository: DevelopersRepository) {}

  async execute({
    userId,
    price_per_hour,
    occupation_area,
    available_for_contract,
    linkedin,
    github,
    portfolio,
  }: EditDeveloperDataUseCaseRequest): Promise<EditDeveloperDataUseCaseResponse> {
    const developer = await this.developersRepository.findByUserId(userId)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    developer.price_per_hour = price_per_hour ?? developer.price_per_hour
    developer.occupation_area = occupation_area ?? developer.occupation_area
    developer.available_for_contract =
      available_for_contract ?? developer.available_for_contract
    developer.linkedin = linkedin ?? developer.linkedin
    developer.github = github ?? developer.github
    developer.portfolio = portfolio ?? developer.portfolio

    await this.developersRepository.save(developer)

    return right({
      developer,
    })
  }
}
