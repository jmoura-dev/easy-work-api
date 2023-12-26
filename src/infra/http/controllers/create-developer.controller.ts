import { CreateDeveloperUseCase } from '@/domain/easy-work/application/use-cases/create-developer'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  NotAcceptableException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const createBodySchema = z.object({
  userId: z.string().uuid(),
  price_per_hour: z.number().optional(),
  occupation_area: z.string(),
  available_for_contract: z.boolean().optional().default(false),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/developers')
export class CreateDeveloperController {
  constructor(private createDeveloper: CreateDeveloperUseCase) {}

  @Post()
  @Public()
  async create(@Body(zodValidationPipe) body: CreateBodySchema) {
    const { userId, price_per_hour, occupation_area, available_for_contract } =
      body

    const result = await this.createDeveloper.execute({
      userId,
      price_per_hour,
      occupation_area,
      available_for_contract,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof NotAllowedError)
        switch (error.constructor) {
          case NotAllowedError:
            throw new NotAcceptableException()
          default:
            throw new BadRequestException(error.message)
        }
    }
  }
}
