import { Job } from '@/domain/easy-work/enterprise/entities/job'

export class JobPresenter {
  static toHttp(job: Job) {
    return {
      id: job.id.toString(),
      title: job.title,
      description: job.description,
      workMode: job.workMode,
      workSchedule: job.workSchedule,
      remuneration: job.remuneration,
      hoursPerWeek: job.hoursPerWeek,
      created_at: job.created_at,
    }
  }
}
