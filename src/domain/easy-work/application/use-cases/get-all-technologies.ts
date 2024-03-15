import { Injectable } from '@nestjs/common'
import { Technology } from '../../enterprise/entities/technology'
import { TechnologiesRepository } from '../repositories/technologies-repository'

interface GetAllTechnologiesUseCaseResponse {
  technologies: Technology[]
}

@Injectable()
export class GetAllTechnologiesUseCase {
  constructor(private technologiesRepository: TechnologiesRepository) {}

  async execute(): Promise<GetAllTechnologiesUseCaseResponse> {
    const technologies = await this.technologiesRepository.findMany()

    return { technologies }
  }
}
