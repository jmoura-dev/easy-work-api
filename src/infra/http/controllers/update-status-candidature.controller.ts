import { UpdateStatusCandidatureUseCase } from '@/domain/easy-work/application/use-cases/update-status-candidature'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotAcceptableException,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const status = z.string()

const zodValidationPipe = new ZodValidationPipe(status)

type Status = z.infer<typeof status>

@Controller('/candidatures/:candidature_id')
export class UpdateStatusCandidatureController {
  constructor(
    private updateStatusCandidature: UpdateStatusCandidatureUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('candidature_id') candidatureId: string,
    @Body('status', zodValidationPipe) status: Status,
  ) {
    const { sub: userId } = user

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
