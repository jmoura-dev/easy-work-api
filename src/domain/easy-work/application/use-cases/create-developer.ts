import { Either, left, right } from '@/core/either'
import { EmailAlreadyExists } from './errors/email-already-exists-error'
import { DevelopersRepository } from '../repositories/developers-repository'
import { Developer } from '../../enterprise/entities/user-developer'

interface CreateDeveloperUseCaseRequest {
  name: string
  email: string
  password: string
  price_per_hour?: string
  occupation_area: string
  available_for_contract?: boolean
}

type CreateDeveloperUseCaseResponse = Either<EmailAlreadyExists, null>

export class CreateDeveloperUseCase {
  constructor(private developersRepository: DevelopersRepository) {}

  async execute({
    name,
    email,
    password,
    price_per_hour,
    occupation_area,
    available_for_contract,
  }: CreateDeveloperUseCaseRequest): Promise<CreateDeveloperUseCaseResponse> {
    const developer = Developer.create({
      name,
      email,
      password,
      available_for_contract,
      occupation_area,
      price_per_hour,
    })

    const developerAlreadyExists =
      await this.developersRepository.findByEmail(email)

    if (developerAlreadyExists) {
      return left(new EmailAlreadyExists(email))
    }

    await this.developersRepository.create(developer)

    return right(null)
  }
}
