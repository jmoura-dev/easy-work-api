import { JobWithCandidaturesAmount } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-candidatures-amount'

export class JobWithCandidaturesAmountPresenter {
  static toHttp(job: JobWithCandidaturesAmount) {
    return {
      id: job.jobId.toString(),
      title: job.title.toLowerCase(),
      description: job.description,
      workMode: job.workMode.toLowerCase(),
      workSchedule: job.workSchedule,
      remuneration: job.remuneration,
      hoursPerWeek: job.hoursPerWeek,
      created_at: job.createdAt,
      candidaturesAmount: job.amountCandidatures,
      candidatures: job.candidatures.map((candidature) => {
        return {
          ...candidature,
          candidatureId: candidature.candidatureId.toString(),
        }
      }),
    }
  }
}
