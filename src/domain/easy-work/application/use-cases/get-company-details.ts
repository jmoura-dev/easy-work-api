import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CompanyWithDetails } from '../../enterprise/entities/value-objects/company-with-details'
import { UsersRepository } from '../repositories/users-repository'

interface GetCompanyDetailsUseCaseRequest {
  userId: string
}

type GetCompanyDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    companyWithDetails: CompanyWithDetails
  }
>

export class GetCompanyDetailsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    userId,
  }: GetCompanyDetailsUseCaseRequest): Promise<GetCompanyDetailsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const company = await this.companiesRepository.findByUserId(
      user.id.toString(),
    )

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    const companyWithDetails =
      await this.companiesRepository.findCompanyDetailsById(
        company.id.toString(),
      )

    if (!companyWithDetails) {
      return left(new ResourceNotFoundError())
    }

    return right({
      companyWithDetails,
    })
  }
}
