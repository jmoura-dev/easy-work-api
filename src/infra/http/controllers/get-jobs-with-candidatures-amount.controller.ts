import { GetJobWithCandidaturesAmountUseCase } from '@/domain/easy-work/application/use-cases/get-job-with-candidatures-amount'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Get, NotFoundException } from '@nestjs/common'
import { JobWithCandidaturesAmountPresenter } from '../presenters/job-with-candidatures-amount'

@Controller('/jobs/:user_id/candidatures/amount')
export class GetJobsWithCandidaturesAmountController {
  constructor(
    private getJobsWithCandidaturesAmount: GetJobWithCandidaturesAmountUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user

    const result = await this.getJobsWithCandidaturesAmount.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new NotFoundException({ message: 'Dados não encontrados.' })
    }

    const jobs = result.value.jobs

    const jobsWithCandidaturesAmount = jobs.map((job) =>
      JobWithCandidaturesAmountPresenter.toHttp(job),
    )

    return {
      jobsWithCandidaturesAmount,
    }
  }
}
