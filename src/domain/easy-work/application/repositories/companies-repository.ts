import { Company } from '../../enterprise/entities/user-company'

export abstract class CompaniesRepository {
  abstract create(company: Company): Promise<void>
  abstract findById(id: string): Promise<Company | null>
  abstract save(company: Company): Promise<void>
}
