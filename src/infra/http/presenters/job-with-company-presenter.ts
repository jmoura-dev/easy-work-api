import { JobWithCompany } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-company'

export class JobWithCompanyPresenter {
  static toHTTP(jobWithCompany: JobWithCompany) {
    return {
      id: jobWithCompany.jobId.toString(),
      companyName: jobWithCompany.companyName,
      title: jobWithCompany.title.toLowerCase(),
      description: jobWithCompany.description,
      created_at: jobWithCompany.created_at,
    }
  }
}
