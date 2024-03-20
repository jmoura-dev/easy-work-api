import { CompanyWithDetails } from '@/domain/easy-work/enterprise/entities/value-objects/company-with-details'

export class CompanyWithDetailsPresenter {
  static toHTTP(companyWithDetails: CompanyWithDetails) {
    return {
      companyId: companyWithDetails.companyId.toString(),
      avatarUrl: companyWithDetails.avatarUrl?.toString(),
      userName: companyWithDetails.userName.toLowerCase(),
      state: companyWithDetails.state,
      city: companyWithDetails.city,
      site_url: companyWithDetails.site_url,
      about: companyWithDetails.about,
    }
  }
}
