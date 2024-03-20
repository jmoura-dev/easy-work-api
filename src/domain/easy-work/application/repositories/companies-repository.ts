import { Company } from '../../enterprise/entities/user-company'
import { CompanyWithDetails } from '../../enterprise/entities/value-objects/company-with-details'

export abstract class CompaniesRepository {
  abstract create(company: Company): Promise<void>
  abstract findById(id: string): Promise<Company | null>
  abstract findByUserId(userId: string): Promise<Company | null>
  abstract save(company: Company): Promise<void>
  abstract findCompanyDetailsById(
    id: string,
  ): Promise<CompanyWithDetails | null>
}
