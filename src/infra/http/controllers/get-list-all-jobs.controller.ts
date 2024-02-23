import { GetAllJobsUseCase } from '@/domain/easy-work/application/use-cases/get-list-all-jobs'
import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JobWithCompanyPresenter } from '../presenters/job-with-company-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageZodQueryParamPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/jobs/fetch/list')
export class GetListAllJobsController {
  constructor(private getListAllJobs: GetAllJobsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageZodQueryParamPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.getListAllJobs.execute({
      page,
    })

    const allJobs = result.jobsWithCompany

    const jobs = allJobs.map((job) => JobWithCompanyPresenter.toHTTP(job))

    return {
      jobs,
    }
  }
}
