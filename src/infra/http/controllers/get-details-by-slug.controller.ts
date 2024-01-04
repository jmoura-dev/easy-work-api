import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetJobDetailsBySlugUseCase } from '@/domain/easy-work/application/use-cases/get-job-details-by-slug'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
  Param,
} from '@nestjs/common'
import { JobPresenter } from '../presenters/job-presenter'

@Controller('/jobs/:slug/slug')
export class GetDetailsBySlugController {
  constructor(private getDetailsBySlug: GetJobDetailsBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getDetailsBySlug.execute({ slug })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotAcceptableException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const jobDomain = result.value.job

    const job = JobPresenter.toHttp(jobDomain)

    return {
      job,
    }
  }
}
