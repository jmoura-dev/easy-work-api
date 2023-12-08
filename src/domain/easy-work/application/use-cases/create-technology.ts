import { Either, left, right } from '@/core/either'
import { TechnologiesRepository } from '../repositories/technologies-repository'
import { TechnologyNameAlreadyExists } from './errors/technology-name-already-exists-error'
import { Technology } from '../../enterprise/entities/technology'

interface CreateTechnologyUseCaseRequest {
  name: string
}

type CreateTechnologyUseCaseResponse = Either<TechnologyNameAlreadyExists, null>

export class CreateTechnologyUseCase {
  constructor(private technologiesRepository: TechnologiesRepository) {}

  async execute({
    name,
  }: CreateTechnologyUseCaseRequest): Promise<CreateTechnologyUseCaseResponse> {
    const checkedName = await this.technologiesRepository.findByName(name)

    if (checkedName) {
      return left(new TechnologyNameAlreadyExists(name))
    }

    const technology = Technology.create({
      name,
    })

    await this.technologiesRepository.create(technology)

    return right(null)
  }
}
