import { EditUserDataUseCase } from '@/domain/easy-work/application/use-cases/edit-user-data'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  Controller,
  Put,
  Body,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WrongCredentialsError } from '@/domain/easy-work/application/use-cases/errors/wrong-credentials-error'

const editUserBodySchema = z.object({
  name: z.string().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
  avatarId: z.string().optional(),
  about: z.string().optional(),
})

const zodValidationPipe = new ZodValidationPipe(editUserBodySchema)

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@Controller('/users/:user_id')
export class EditUserController {
  constructor(private editUserDataUseCase: EditUserDataUseCase) {}

  @Put()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: EditUserBodySchema,
  ) {
    const { sub: userId } = user
    const { name, oldPassword, newPassword, avatarId, about } = body

    const result = await this.editUserDataUseCase.execute({
      userId,
      name,
      oldPassword,
      newPassword,
      avatarId,
      about,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotAcceptableException(error.message)
        case WrongCredentialsError:
          throw new NotAcceptableException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
