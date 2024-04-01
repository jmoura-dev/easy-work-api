import { AddTechnologyToDeveloperUseCase } from '@/domain/easy-work/application/use-cases/add-technology-to-developer'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  NotAcceptableException,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { TechnologyAlreadyAddedInTheDeveloper } from '@/domain/easy-work/application/use-cases/errors/technology-already-added-in-the-developer.erro'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Public } from '@/infra/auth/public'

const createBodySchema = z.object({
  technologyName: z.string(),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/developer-technology/:user_id')
export class AddTechnologyToDeveloperController {
  constructor(
    private addTechnologyToDeveloper: AddTechnologyToDeveloperUseCase,
  ) {}

  @Post()
  @Public()
  async handle(
    @Param('user_id') userId: string,
    @Body(zodValidationPipe) body: CreateBodySchema,
  ) {
    const { technologyName } = body

    const result = await this.addTechnologyToDeveloper.execute({
      userId,
      technologyName,
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
