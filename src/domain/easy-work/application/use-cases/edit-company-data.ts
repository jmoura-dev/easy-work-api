import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Company } from '../../enterprise/entities/user-company'

interface EditCompanyDataUseCaseRequest {
  companyId: string
  cnpj?: string
  site_url?: string
}

type EditCompanyDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    company: Company
  }
>

export class EditCompanyDataUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    companyId,
    cnpj,
    site_url,
  }: EditCompanyDataUseCaseRequest): Promise<EditCompanyDataUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    company.cnpj = cnpj ?? company.cnpj
    company.site_url = site_url ?? company.site_url

    await this.companiesRepository.save(company)

    return right({
      company,
    })
  }
}
