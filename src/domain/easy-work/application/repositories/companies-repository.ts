import { Company } from '../../enterprise/entities/company'

export interface CompaniesRepository {
  create(company: Company): Promise<void>
  findById(id: string): Promise<Company | null>
  findByEmail(email: string): Promise<Company | null>
  save(company: Company): Promise<void>
}
