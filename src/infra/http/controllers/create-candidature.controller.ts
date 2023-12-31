import { CreateCandidatureUseCase } from '@/domain/easy-work/application/use-cases/create-candidature'
import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const createBodySchema = z.object({
  jobId: z.string().uuid(),
  status: z.string().optional(),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/candidatures')
export class CreateCandidatureController {
  constructor(private createCandidature: CreateCandidatureUseCase) {}

  @Post()
  async create(
    @Body(zodValidationPipe) body: CreateBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: userId } = user
    const { jobId, status } = body

    const result = await this.createCandidature.execute({
      userId,
      jobId,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException()
      }
    }
  }
}
