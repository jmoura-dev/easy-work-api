import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Company } from '../../enterprise/entities/user-company'
import { Injectable } from '@nestjs/common'

interface EditCompanyDataUseCaseRequest {
  userId: string
  cnpj?: string
  site_url?: string
}

type EditCompanyDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    company: Company
  }
>

@Injectable()
export class EditCompanyDataUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    userId,
    cnpj,
    site_url,
  }: EditCompanyDataUseCaseRequest): Promise<EditCompanyDataUseCaseResponse> {
    const company = await this.companiesRepository.findByUserId(userId)

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
