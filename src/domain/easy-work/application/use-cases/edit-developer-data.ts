import { Either, left, right } from '@/core/either'
import { DevelopersRepository } from '../repositories/developers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Developer } from '../../enterprise/entities/user-developer'

interface EditDeveloperDataUseCaseRequest {
  name?: string
  email: string
  password?: string
  price_per_hour?: number
  occupation_area?: string
  available_for_contract?: boolean
}

type EditDeveloperDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    developer: Developer
  }
>

export class EditDeveloperDataUseCase {
  constructor(private developersRepository: DevelopersRepository) {}

  async execute({
    name,
    email,
    password,
    price_per_hour,
    occupation_area,
    available_for_contract,
  }: EditDeveloperDataUseCaseRequest): Promise<EditDeveloperDataUseCaseResponse> {
    const developer = await this.developersRepository.findByEmail(email)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }

    developer.name = name ?? developer.name
    developer.password = password ?? developer.password
    developer.price_per_hour = price_per_hour ?? developer.price_per_hour
    developer.occupation_area = occupation_area ?? developer.occupation_area
    developer.available_for_contract =
      available_for_contract ?? developer.available_for_contract

    await this.developersRepository.save(developer)

    return right({
      developer,
    })
  }
}
