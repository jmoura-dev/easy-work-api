import {
  DevelopersRepository,
  FindManyProps,
} from '@/domain/easy-work/application/repositories/developers-repository'
import { Developer } from '@/domain/easy-work/enterprise/entities/user-developer'
import { InMemoryUsersRepository } from './in-memory-users-repository'
import { InMemoryDeveloperTechnologiesRepository } from './in-memory-developer-technologies-repository'
import { InMemoryTechnologiesRepository } from './in-memory-technologies-repository'
import { DeveloperWithTechnologies } from '@/domain/easy-work/enterprise/entities/value-objects/developer-with-technologies'
import { Technology } from '@/domain/easy-work/enterprise/entities/technology'

export class InMemoryDevelopersRepository implements DevelopersRepository {
  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryDeveloperTechnologiesRepository: InMemoryDeveloperTechnologiesRepository,
    private inMemoryTechnologiesRepository: InMemoryTechnologiesRepository,
  ) {}

  public items: Developer[] = []

  async create(developer: Developer): Promise<void> {
    this.items.push(developer)
  }

  async findById(id: string): Promise<Developer | null> {
    const developer = this.items.find((item) => item.id.toString() === id)

    if (!developer) {
      return null
    }

    return developer
  }

  async findByUserId(userId: string): Promise<Developer | null> {
    const developer = this.items.find(
      (item) => item.userId.toString() === userId,
    )

    if (!developer) {
      return null
    }

    return developer
  }

  async findManyWithTechnologies({
    name,
    occupation_area,
    techs,
    page,
  }: FindManyProps): Promise<DeveloperWithTechnologies[]> {
    let users = this.inMemoryUsersRepository.items

    if (name) {
      users = users.filter((user) => user.name === name)
    }

    const allDevelopers = users.flatMap((user) =>
      this.items.filter((developer) => developer.userId === user.id),
    )

    const filteredByArea = occupation_area
      ? allDevelopers.filter(
          (developer) => developer.occupation_area === occupation_area,
        )
      : allDevelopers

    const filteredByTechnology =
      techs.length > 0
        ? filteredByArea.filter((developer) =>
            techs.every((tech) =>
              this.inMemoryDeveloperTechnologiesRepository.items.some(
                (item) => {
                  const technology =
                    this.inMemoryTechnologiesRepository.items.find(
                      (technology) =>
                        technology.id === item.technologyId &&
                        item.developerId.equals(developer.id),
                    )

                  return technology && technology.name === tech
                },
              ),
            ),
          )
        : filteredByArea

    const technologies = techs.map((tech) => {
      const isTechValid = this.inMemoryTechnologiesRepository.findByName(tech)

      if (!isTechValid) {
        throw new Error(`This technology ${tech} does not exist`)
      }

      return Technology.create({
        name: tech,
      })
    })

    const developers = filteredByTechnology
      .slice((page - 1) * 20, page * 20)
      .map((developer) => {
        const user = this.inMemoryUsersRepository.items.find(
          (user) => user.id === developer.userId,
        )

        if (!user) {
          throw new Error(
            `User with ID "${developer.userId.toString()}" does not exist`,
          )
        }

        return DeveloperWithTechnologies.create({
          developerId: developer.id,
          userName: user.name,
          about: user.about,
          occupation_area: developer.occupation_area,
          available_for_contract: developer.available_for_contract,
          price_per_hour: developer.price_per_hour,
          techs: technologies,
        })
      })

    return developers
  }

  async findDetailsById(id: string): Promise<DeveloperWithTechnologies | null> {
    const developer = this.items.find((item) => item.id.toString() === id)

    if (!developer) {
      return null
    }

    const user = await this.inMemoryUsersRepository.findById(
      developer.userId.toString(),
    )

    if (!user) {
      return null
    }

    const developerWithDetails = DeveloperWithTechnologies.create({
      developerId: developer.id,
      userName: user.name,
      about: user.about,
      available_for_contract: developer.available_for_contract,
      occupation_area: developer.occupation_area,
      price_per_hour: developer.price_per_hour,
      techs: [],
    })

    return developerWithDetails
  }

  async save(developer: Developer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === developer.id)

    this.items[itemIndex] = developer
  }
}
