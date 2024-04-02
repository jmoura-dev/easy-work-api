import { Either, left, right } from '@/core/either'
import { DeveloperTechnologiesRepository } from '../repositories/developer-technologies-repository'
import { DevelopersRepository } from '../repositories/developers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeveloperTechnology } from '../../enterprise/entities/developer-technology'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TechnologiesRepository } from '../repositories/technologies-repository'
import { TechnologyNotFound } from './errors/technology-not-found-error'
import { Injectable } from '@nestjs/common'

interface UpdateDeveloperTechnologiesRequest {
  userId: string
  techs: {
    name: string
  }[]
}

type UpdateDeveloperTechnologiesResponse = Either<
  ResourceNotFoundError | TechnologyNotFound,
  null
>

@Injectable()
export class UpdateDeveloperTechnologiesUseCase {
  constructor(
    private developerTechnologiesRepository: DeveloperTechnologiesRepository,
    private developersRepository: DevelopersRepository,
    private technologiesRepository: TechnologiesRepository,
  ) {}

  async execute({
    userId,
    techs,
  }: UpdateDeveloperTechnologiesRequest): Promise<UpdateDeveloperTechnologiesResponse> {
    const developer = await this.developersRepository.findByUserId(userId)

    if (!developer) {
      return left(new ResourceNotFoundError())
    }
    const developerId = developer.id.toString()

    const technologiesByDeveloper =
      await this.developerTechnologiesRepository.findManyByDeveloperId(
        developerId,
      )

    const newTechnologiesToAdd = techs.filter((tech) =>
      technologiesByDeveloper.every((item) => item.name !== tech.name),
    )

    const technologiesWithIdToAdd = await Promise.all(
      newTechnologiesToAdd.map(async (tech) => {
        const isTechValid = await this.technologiesRepository.findByName(
          tech.name,
        )

        if (!isTechValid) {
          throw new TechnologyNotFound(tech.name)
        }

        return isTechValid
      }),
    )

    await Promise.all(
      technologiesWithIdToAdd.map(async (tech) => {
        const newDeveloperTechnology = DeveloperTechnology.create({
          developerId: new UniqueEntityID(developerId),
          technologyId: tech.id,
        })

        return await this.developerTechnologiesRepository.create(
          newDeveloperTechnology,
        )
      }),
    )

    const developerTechnologiesToDelete = technologiesByDeveloper.filter(
      (item) => techs.every((tech) => tech.name !== item.name),
    )

    const developerTechnologiesWithIdToDelete = await Promise.all(
      developerTechnologiesToDelete.map(async (item) => {
        const isDeveloperTechnologyValid =
          await this.developerTechnologiesRepository.findById({
            technologyId: item.id.toString(),
            developerId,
          })

        if (!isDeveloperTechnologyValid) {
          throw new ResourceNotFoundError()
        }

        return isDeveloperTechnologyValid
      }),
    )

    await Promise.all(
      developerTechnologiesWithIdToDelete.map(
        async (tech) =>
          await this.developerTechnologiesRepository.delete(tech.id.toString()),
      ),
    )

    return right(null)
  }
}
