import { EditCompanyDataUseCase } from '@/domain/easy-work/application/use-cases/edit-company-data'
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

const editCompanyBodySchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
  site_url: z.string().optional(),
})

const zodValidationPipe = new ZodValidationPipe(editCompanyBodySchema)

type EditCompanyBodySchema = z.infer<typeof editCompanyBodySchema>

@Controller('/companies')
export class EditCompanyController {
  constructor(private editCompanyData: EditCompanyDataUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: EditCompanyBodySchema,
  ) {
    const { sub: userId } = user
    const { state, city, site_url } = body

    const result = await this.editCompanyData.execute({
      userId,
      state,
      city,
      site_url,
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
