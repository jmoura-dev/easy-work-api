import { Either, left, right } from '@/core/either'
import { DeveloperTechnologiesRepository } from '../repositories/developer-technologies-repository'
import { TechnologyAlreadyAddedInTheDeveloper } from './errors/technology-already-added-in-the-developer.erro'
import { DeveloperTechnology } from '../../enterprise/entities/developer-technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AddTechnologyToDeveloperUseCaseRequest {
  developerId: string
  technologyId: string
}

type AddTechnologyToDeveloperUseCaseResponse = Either<
  TechnologyAlreadyAddedInTheDeveloper,
  null
>

export class AddTechnologyToDeveloperUseCase {
  constructor(
    private developerTechnologiesRepository: DeveloperTechnologiesRepository,
  ) {}

  async execute({
    developerId,
    technologyId,
  }: AddTechnologyToDeveloperUseCaseRequest): Promise<AddTechnologyToDeveloperUseCaseResponse> {
    const developerTechnologyArray =
      await this.developerTechnologiesRepository.findManyByTechnologyId(
        technologyId,
      )

    const checkedTechnologySameDeveloper = developerTechnologyArray.find(
      (item) => item.developerId.toString() === developerId,
    )

    if (checkedTechnologySameDeveloper) {
      return left(new TechnologyAlreadyAddedInTheDeveloper())
    }

    const developerTechnology = DeveloperTechnology.create({
      developerId: new UniqueEntityID(developerId),
      technologyId: new UniqueEntityID(technologyId),
    })

    await this.developerTechnologiesRepository.create(developerTechnology)

    return right(null)
  }
}
