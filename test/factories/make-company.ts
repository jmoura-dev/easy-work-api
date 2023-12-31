import { faker } from '@faker-js/faker'
import {
  Company,
  CompanyProps,
} from '@/domain/easy-work/enterprise/entities/user-company'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaCompanyMapper } from '@/infra/database/prisma/mappers/prisma-company-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeCompany(
  override: Partial<CompanyProps> = {},
  id?: UniqueEntityID,
) {
  const company = Company.create(
    {
      userId: new UniqueEntityID(),
      cnpj: faker.string.numeric(14),
      ...override,
    },
    id,
  )

  return company
}

@Injectable()
export class CompanyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompany(data: Partial<CompanyProps> = {}): Promise<Company> {
    const company = makeCompany(data)

    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPrisma(company),
    })

    return company
  }
}
