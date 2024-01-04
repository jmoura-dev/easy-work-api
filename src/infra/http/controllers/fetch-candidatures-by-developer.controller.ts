import { FetchCandidaturesByDeveloperUseCase } from '@/domain/easy-work/application/use-cases/fetch-candidatures-by-developer'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
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

@Controller('/candidatures/:user_id/developer')
export class FetchCandidaturesByDeveloperController {
  constructor(
    private fetchCandidaturesByDeveloper: FetchCandidaturesByDeveloperUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', zodValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: userId } = user

    const result = await this.fetchCandidaturesByDeveloper.execute({
      page,
      userId,
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
