import { AddTechnologyToDeveloperUseCase } from '@/domain/easy-work/application/use-cases/add-technology-to-developer'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  NotAcceptableException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { TechnologyAlreadyAddedInTheDeveloper } from '@/domain/easy-work/application/use-cases/errors/technology-already-added-in-the-developer.erro'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const createBodySchema = z.object({
  technologyId: z.string(),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/developer-technology')
export class AddTechnologyToDeveloperController {
  constructor(
    private addTechnologyToDeveloper: AddTechnologyToDeveloperUseCase,
  ) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: CreateBodySchema,
  ) {
    const { sub: userId } = user
    const { technologyId } = body

    const result = await this.addTechnologyToDeveloper.execute({
      userId,
      technologyId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new NotAcceptableException()
        case TechnologyAlreadyAddedInTheDeveloper:
          throw new ConflictException()
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
