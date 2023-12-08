import { Either, left, right } from '@/core/either'
import { EmailAlreadyExists } from './errors/email-already-exists-error'
import { CompaniesRepository } from '../repositories/companies-repository'
import { Company } from '../../enterprise/entities/company'

interface CreateCompanyUseCaseRequest {
  name: string
  email: string
  password: string
  cnpj: string
  city?: string
  state?: string
  site_url?: string
}

type CreateCompanyUseCaseResponse = Either<EmailAlreadyExists, null>

export class CreateCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    name,
    email,
    password,
    cnpj,
    city,
    state,
    site_url,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const company = Company.create({
      name,
      email,
      password,
      cnpj,
      city,
      state,
      site_url,
    })

    const companyAlreadyExists =
      await this.companiesRepository.findByEmail(email)

    if (companyAlreadyExists) {
      return left(new EmailAlreadyExists(email))
    }

    await this.companiesRepository.create(company)

    return right(null)
  }
}
