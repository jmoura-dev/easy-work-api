import { FetchListCandidaturesByJobUseCase } from '@/domain/easy-work/application/use-cases/fetch-list-candidatures-by-job'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CandidaturePresenter } from '../presenters/candidature-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const zodValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/candidatures/:job_id')
export class FetchListCandidaturesByJobController {
  constructor(
    private fetchListCandidaturesByJob: FetchListCandidaturesByJobUseCase,
  ) {}

  @Get()
  async handle(
    @Param('job_id') jobId: string,
    @Query('page', zodValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchListCandidaturesByJob.execute({
      jobId,
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

    const candidaturesArray = result.value.candidatures

    const candidatures = candidaturesArray.map((candidature) =>
      CandidaturePresenter.toHttp(candidature),
    )

    return {
      candidatures,
    }
  }
}
