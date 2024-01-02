import { EditDeveloperDataUseCase } from '@/domain/easy-work/application/use-cases/edit-developer-data'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
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
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const editDeveloperBodySchema = z.object({
  price_per_hour: z.number().optional(),
  occupation_area: z.string().optional(),
  available_for_contract: z.boolean().optional(),
})

const zodValidationPipe = new ZodValidationPipe(editDeveloperBodySchema)

type EditDeveloperBodySchema = z.infer<typeof editDeveloperBodySchema>

@Controller('/developers')
export class EditDeveloperController {
  constructor(private editDeveloperData: EditDeveloperDataUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: EditDeveloperBodySchema,
  ) {
    const { sub: userId } = user
    const { price_per_hour, occupation_area, available_for_contract } = body

    const result = await this.editDeveloperData.execute({
      userId,
      price_per_hour,
      occupation_area,
      available_for_contract,
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
