import { JobWithCandidaturesAmount } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-candidatures-amount'

export class JobWithCandidaturesAmountPresenter {
  static toHttp(job: JobWithCandidaturesAmount) {
    return {
      id: job.jobId.toString(),
      title: job.title,
      description: job.description,
      workMode: job.workMode,
      workSchedule: job.workSchedule,
      remuneration: job.remuneration,
      hoursPerWeek: job.hoursPerWeek,
      created_at: job.createdAt,
      candidaturesAmount: job.amountCandidatures,
    }
  }
}
