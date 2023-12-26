import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/easy-work/enterprise/entities/user-company'
import { Prisma, Company as PrismaCompany } from '@prisma/client'

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create({
      userId: new UniqueEntityID(raw.userId),
      cnpj: raw.cnpj,
      city: raw.city,
      state: raw.state,
      site_url: raw.site_url,
    })
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      userId: company.userId.toString(),
      cnpj: company.cnpj,
      city: company.city,
      state: company.state,
      site_url: company.site_url,
    }
  }
}
