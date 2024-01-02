import { CompaniesRepository } from '@/domain/easy-work/application/repositories/companies-repository'
import { Company } from '@/domain/easy-work/enterprise/entities/user-company'
import { Injectable } from '@nestjs/common'
import { PrismaCompanyMapper } from '../mappers/prisma-company-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(private prisma: PrismaService) {}

  async create(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPrisma(company)

    await this.prisma.company.create({
      data,
    })
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
    })

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        userId,
      },
    })

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }

  async save(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPrisma(company)

    await this.prisma.company.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
