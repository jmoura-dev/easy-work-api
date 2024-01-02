import { CreateTechnologyUseCase } from '@/domain/easy-work/application/use-cases/create-technology'
import { Body, Controller, ForbiddenException, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { TechnologyNameAlreadyExists } from '@/domain/easy-work/application/use-cases/errors/technology-name-already-exists-error'

const createBodySchema = z.object({
  name: z.string(),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/technologies')
export class CreateTechnologyController {
  constructor(private createTechnology: CreateTechnologyUseCase) {}

  @Post()
  async create(@Body(zodValidationPipe) body: CreateBodySchema) {
    const { name } = body

    const result = await this.createTechnology.execute({
      name,
    })

    if (result.isLeft()) {
      if (result.value instanceof TechnologyNameAlreadyExists) {
        throw new ForbiddenException(result.value.message)
      }
    }
  }
}
