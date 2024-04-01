import { Either, left, right } from '@/core/either'
import { DevelopersRepository } from '../repositories/developers-repository'
import { Developer } from '../../enterprise/entities/user-developer'
import { UsersRepository } from '../repositories/users-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface CreateDeveloperUseCaseRequest {
  userId: string
  price_per_hour?: number
  occupation_area: string
  available_for_contract?: boolean
  linkedin?: string
  github?: string
  portfolio?: string
}

type CreateDeveloperUseCaseResponse = Either<NotAllowedError, null>

@Injectable()
export class CreateDeveloperUseCase {
  constructor(
    private developersRepository: DevelopersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    price_per_hour,
    occupation_area,
    available_for_contract,
    linkedin,
    github,
    portfolio,
  }: CreateDeveloperUseCaseRequest): Promise<CreateDeveloperUseCaseResponse> {
    const developer = Developer.create({
      userId: new UniqueEntityID(userId),
      available_for_contract,
      occupation_area,
      price_per_hour,
      linkedin,
      portfolio,
      github,
    })

    const doesUserExists = await this.usersRepository.findById(userId)

    if (!doesUserExists) {
      return left(new NotAllowedError())
    }

    await this.developersRepository.create(developer)

    return right(null)
  }
}
