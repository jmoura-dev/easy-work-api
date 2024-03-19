import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/easy-work/enterprise/entities/user-company'
import { Prisma, Company as PrismaCompany } from '@prisma/client'

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create(
      {
        userId: new UniqueEntityID(raw.userId),
        city: raw.city,
        state: raw.state,
        site_url: raw.site_url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      userId: company.userId.toString(),
      city: company.city,
      state: company.state,
      site_url: company.site_url,
    }
  }
}
