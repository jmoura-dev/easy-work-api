import { UpdateStatusCandidatureUseCase } from '@/domain/easy-work/application/use-cases/update-status-candidature'
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

const updateBodySchema = z.object({
  candidatureId: z.string().uuid(),
  status: z.string(),
})

const zodValidationPipe = new ZodValidationPipe(updateBodySchema)

type UpdateBodySchema = z.infer<typeof updateBodySchema>

@Controller('/candidatures/:candidature_id')
export class UpdateStatusCandidatureController {
  constructor(
    private updateStatusCandidature: UpdateStatusCandidatureUseCase,
  ) {}

  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: UpdateBodySchema,
  ) {
    const { sub: userId } = user
    const { candidatureId, status } = body

    const result = await this.updateStatusCandidature.execute({
      userId,
      candidatureId,
      status,
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
