import { Either, left, right } from '@/core/either'
import { DeveloperTechnologiesRepository } from '../repositories/developer-technologies-repository'
import { TechnologyAlreadyAddedInTheDeveloper } from './errors/technology-already-added-in-the-developer.erro'
import { DeveloperTechnology } from '../../enterprise/entities/developer-technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DevelopersRepository } from '../repositories/developers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { TechnologiesRepository } from '../repositories/technologies-repository'

interface AddTechnologyToDeveloperUseCaseRequest {
  userId: string
  technologyName: string
}

type AddTechnologyToDeveloperUseCaseResponse = Either<
  TechnologyAlreadyAddedInTheDeveloper | NotAllowedError,
  null
>

@Injectable()
export class AddTechnologyToDeveloperUseCase {
  constructor(
    private developerTechnologiesRepository: DeveloperTechnologiesRepository,
    private developersRepository: DevelopersRepository,
    private technologiesRepository: TechnologiesRepository,
  ) {}

  async execute({
    userId,
    technologyName,
  }: AddTechnologyToDeveloperUseCaseRequest): Promise<AddTechnologyToDeveloperUseCaseResponse> {
    const developer = await this.developersRepository.findByUserId(userId)

    if (!developer) {
      return left(new NotAllowedError())
    }

    const technology =
      await this.technologiesRepository.findByName(technologyName)

    if (!technology) {
      return left(new NotAllowedError())
    }

    const technologyId = technology.id.toString()

    const developerTechnologyArray =
      await this.developerTechnologiesRepository.findManyByTechnologyId(
        technologyId,
      )

    const checkedTechnologySameDeveloper = developerTechnologyArray.find(
      (item) => item.developerId.toString() === developer.id.toString(),
    )

    if (checkedTechnologySameDeveloper) {
      return left(new TechnologyAlreadyAddedInTheDeveloper())
    }

    const developerTechnology = DeveloperTechnology.create({
      developerId: new UniqueEntityID(developer.id.toString()),
      technologyId: new UniqueEntityID(technologyId),
    })

    await this.developerTechnologiesRepository.create(developerTechnology)

    return right(null)
  }
}
