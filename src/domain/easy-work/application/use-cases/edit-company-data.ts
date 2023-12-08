import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Company } from '../../enterprise/entities/company'

interface EditCompanyDataUseCaseRequest {
  name?: string
  email: string
  password?: string
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
    name,
    email,
    password,
    site_url,
  }: EditCompanyDataUseCaseRequest): Promise<EditCompanyDataUseCaseResponse> {
    const company = await this.companiesRepository.findByEmail(email)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    company.name = name ?? company.name
    company.password = password ?? company.password
    company.site_url = site_url ?? company.site_url

    await this.companiesRepository.save(company)

    return right({
      company,
    })
  }
}
