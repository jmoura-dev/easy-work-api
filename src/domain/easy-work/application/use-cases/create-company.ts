import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '../repositories/companies-repository'
import { Company } from '../../enterprise/entities/user-company'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface CreateCompanyUseCaseRequest {
  userId: string
  city?: string
  state?: string
  site_url?: string
}

type CreateCompanyUseCaseResponse = Either<NotAllowedError, null>

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    city,
    state,
    site_url,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const company = Company.create({
      userId: new UniqueEntityID(userId),
      city,
      state,
      site_url,
    })

    const doesUserExists = await this.usersRepository.findById(userId)

    if (!doesUserExists) {
      return left(new NotAllowedError())
    }

    await this.companiesRepository.create(company)

    return right(null)
  }
}
