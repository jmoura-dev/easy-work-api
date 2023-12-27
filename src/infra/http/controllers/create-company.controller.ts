import { CreateCompanyUseCase } from '@/domain/easy-work/application/use-cases/create-company'
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
  cnpj: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  site_url: z.string().optional(),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/companies')
export class CreateCompanyController {
  constructor(private createCompany: CreateCompanyUseCase) {}

  @Post()
  @Public()
  async create(@Body(zodValidationPipe) body: CreateBodySchema) {
    const { userId, cnpj, city, state, site_url } = body

    const result = await this.createCompany.execute({
      userId,
      cnpj,
      city,
      state,
      site_url,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new NotAcceptableException()
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
