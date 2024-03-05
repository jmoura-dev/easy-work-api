import { JobWithCompany } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-company'

export class JobWithCompanyPresenter {
  static toHTTP(jobWithCompany: JobWithCompany) {
    return {
      id: jobWithCompany.jobId.toString(),
      companyName: jobWithCompany.companyName,
      title: jobWithCompany.title.toLowerCase(),
      description: jobWithCompany.description,
      workMode: jobWithCompany.workMode.toLowerCase(),
      workSchedule: jobWithCompany.workSchedule,
      remuneration: jobWithCompany.remuneration,
      hoursPerWeek: jobWithCompany.hoursPerWeek,
      created_at: jobWithCompany.created_at,
    }
  }
}
