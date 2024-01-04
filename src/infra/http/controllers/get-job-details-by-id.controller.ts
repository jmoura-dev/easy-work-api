import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetJobDetailsByIdUseCase } from '@/domain/easy-work/application/use-cases/get-job-details-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  NotAcceptableException,
  Param,
} from '@nestjs/common'
import { JobPresenter } from '../presenters/job-presenter'

@Controller('/jobs/:job_id/details')
export class GetJobDetailsByIdController {
  constructor(private getJobDetailsByJobId: GetJobDetailsByIdUseCase) {}

  @Get()
  async handle(@Param('job_id') jobId: string) {
    const result = await this.getJobDetailsByJobId.execute({
      jobId,
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

    const domainJob = result.value.job

    const job = JobPresenter.toHttp(domainJob)

    return {
      job,
    }
  }
}
