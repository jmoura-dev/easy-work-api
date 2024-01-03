import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchListJobsByCompanyUseCase } from '@/domain/easy-work/application/use-cases/fetch-list-jobs-by-company'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { JobPresenter } from '../presenters/job-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const zodValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/jobs/:user_id')
export class FetchListJobsByCompanyController {
  constructor(private fetchListJobsByCompany: FetchListJobsByCompanyUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', zodValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: userId } = user

    const result = await this.fetchListJobsByCompany.execute({
      userId,
      page,
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

    const arrayJobs = result.value.jobs

    const jobs = arrayJobs.map((job) => JobPresenter.toHttp(job))

    return {
      jobs,
    }
  }
}
