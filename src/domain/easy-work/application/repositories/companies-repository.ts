import { Company } from '../../enterprise/entities/user-company'

export interface CompaniesRepository {
  create(company: Company): Promise<void>
  findById(id: string): Promise<Company | null>
  save(company: Company): Promise<void>
}
