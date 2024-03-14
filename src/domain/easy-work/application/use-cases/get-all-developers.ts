import { Injectable } from '@nestjs/common'
import { DevelopersRepository } from '../repositories/developers-repository'
import { DeveloperWithTechnologies } from '../../enterprise/entities/value-objects/developer-with-technologies'

interface GetAllDevelopersUseCaseRequest {
  name?: string
  occupation_area?: string
  techs: string
  page: number
}

interface GetAllDevelopersUseCaseResponse {
  developers: DeveloperWithTechnologies[]
}

@Injectable()
export class GetAllDevelopersUseCase {
  constructor(private developersRepository: DevelopersRepository) {}

  async execute({
    name,
    occupation_area,
    techs,
    page,
  }: GetAllDevelopersUseCaseRequest): Promise<GetAllDevelopersUseCaseResponse> {
    const techsStringToArray = (techsString: string): string[] => {
      if (!techsString) return []
      return techsString.trim().split(',')
    }

    const techsArray = techsStringToArray(techs)

    const developers = await this.developersRepository.findManyWithTechnologies(
      {
        name,
        occupation_area,
        techs: techsArray,
        page,
      },
    )

    return {
      developers,
    }
  }
}
