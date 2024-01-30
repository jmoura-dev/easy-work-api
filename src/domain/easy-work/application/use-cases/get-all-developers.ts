import { Developer } from '../../enterprise/entities/user-developer'
import { DevelopersRepository } from '../repositories/developers-repository'

interface GetAllDevelopersUseCaseRequest {
  name?: string
  occupation_area?: string
  techs: string[]
  page: number
}

interface GetAllDevelopersUseCaseResponse {
  developers: Developer[]
}

export class GetAllDevelopersUseCase {
  constructor(private developersRepository: DevelopersRepository) {}

  async execute({
    name,
    occupation_area,
    techs,
    page,
  }: GetAllDevelopersUseCaseRequest): Promise<GetAllDevelopersUseCaseResponse> {
    const developers = await this.developersRepository.findMany({
      name,
      occupation_area,
      techs,
      page,
    })

    return {
      developers,
    }
  }
}
