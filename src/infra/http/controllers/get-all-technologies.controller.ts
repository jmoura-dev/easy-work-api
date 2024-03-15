import { GetAllTechnologiesUseCase } from '@/domain/easy-work/application/use-cases/get-all-technologies'
import { Controller, Get } from '@nestjs/common'
import { TechnologyPresenter } from '../presenters/technology-presenter'

@Controller('/technologies')
export class GetAllTechnologiesController {
  constructor(private getAllTechnologies: GetAllTechnologiesUseCase) {}

  @Get()
  async handle() {
    const result = await this.getAllTechnologies.execute()

    const domainTechnologies = result.technologies

    const technologies = domainTechnologies.map((technology) =>
      TechnologyPresenter.toHttp(technology),
    )

    return { technologies }
  }
}
