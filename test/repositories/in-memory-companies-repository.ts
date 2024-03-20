import { CompaniesRepository } from '@/domain/easy-work/application/repositories/companies-repository'
import { Company } from '@/domain/easy-work/enterprise/entities/user-company'
import { CompanyWithDetails } from '@/domain/easy-work/enterprise/entities/value-objects/company-with-details'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = []

  async create(company: Company): Promise<void> {
    this.items.push(company)
  }

  async findById(id: string): Promise<Company | null> {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    return company
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const company = this.items.find((item) => item.userId.toString() === userId)

    if (!company) {
      return null
    }

    return company
  }

  async save(company: Company): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === company.id)

    this.items[itemIndex] = company
  }

  async findCompanyDetailsById(id: string): Promise<CompanyWithDetails | null> {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    const companyWithDetails = CompanyWithDetails.create({
      companyId: company.id,
      avatarUrl: null,
      userName: 'Jackson Moura',
      about: null,
      city: null,
      state: null,
      site_url: null,
    })

    return companyWithDetails
  }
}
