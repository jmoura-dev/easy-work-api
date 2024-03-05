import { CandidatureWithJobAndCompany } from '@/domain/easy-work/enterprise/entities/value-objects/candidature-with-job-and-company'

export class CandidatureWithJobAndCompanyPresenter {
  static toHttp(candidatureWithJobAndCompany: CandidatureWithJobAndCompany) {
    return {
      id: candidatureWithJobAndCompany.candidatureId.toString(),
      companyName: candidatureWithJobAndCompany.companyName,
      title: candidatureWithJobAndCompany.jobTitle.toLowerCase(),
      status: candidatureWithJobAndCompany.status,
      created_at: candidatureWithJobAndCompany.createdAt,
      updated_at: candidatureWithJobAndCompany.updatedAt,
    }
  }
}
