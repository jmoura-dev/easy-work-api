import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchListTechnologiesByDeveloperUseCase } from '@/domain/easy-work/application/use-cases/fetch-list-technologies-by-developer'
import { TechnologyPresenter } from '../presenters/technology-presenter'

@Controller('/technologies/:user_id')
export class FetchListTechnologiesByDeveloperController {
  constructor(
    private fetchListTechnologiesByDeveloper: FetchListTechnologiesByDeveloperUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const result = await this.fetchListTechnologiesByDeveloper.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotAcceptableException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const arrayTechnologies = result.value.technologies

    const technologies = arrayTechnologies.map((technology) =>
      TechnologyPresenter.toHttp(technology),
    )

    return {
      technologies,
    }
  }
}
