import { UpdateDeveloperTechnologiesUseCase } from '@/domain/easy-work/application/use-cases/update-developer-technologies'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotAcceptableException,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const techs = z.string().default('')

const zodValidationPipe = new ZodValidationPipe(techs)
type Techs = z.infer<typeof techs>

@Controller('/developer-technology/:user_id/update')
export class UpdateDeveloperTechnologiesController {
  constructor(
    private updateDeveloperTechnologies: UpdateDeveloperTechnologiesUseCase,
  ) {}

  @Put()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body('techs', zodValidationPipe) techs: Techs,
  ) {
    const { sub: userId } = user

    const result = await this.updateDeveloperTechnologies.execute({
      userId,
      techs,
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
  }
}
