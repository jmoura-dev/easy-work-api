import { CreateJobUseCase } from '@/domain/easy-work/application/use-cases/create-job'
import { Body, Controller, ForbiddenException, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const createBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  workMode: z.string(),
  workSchedule: z.string(),
  remuneration: z.number(),
  hoursPerWeek: z.number(),
})

const zodValidationPipe = new ZodValidationPipe(createBodySchema)

type CreateBodySchema = z.infer<typeof createBodySchema>

@Controller('/jobs')
export class CreateJobController {
  constructor(private createJob: CreateJobUseCase) {}

  @Post()
  async create(
    @CurrentUser() user: UserPayload,
    @Body(zodValidationPipe) body: CreateBodySchema,
  ) {
    const { sub: userId } = user
    const {
      title,
      description,
      workMode,
      workSchedule,
      remuneration,
      hoursPerWeek,
    } = body

    const result = await this.createJob.execute({
      userId,
      title,
      description,
      workMode,
      workSchedule,
      remuneration,
      hoursPerWeek,
    })

    if (result.isLeft()) {
      if (result.value instanceof NotAllowedError) {
        throw new ForbiddenException(result.value.message)
      }
    }
  }
}
