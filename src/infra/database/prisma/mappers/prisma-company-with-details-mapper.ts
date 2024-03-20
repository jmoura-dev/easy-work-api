import {
  User as PrismaUser,
  Company as PrismaCompany,
  Avatar as PrismaAvatar,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyWithDetails } from '@/domain/easy-work/enterprise/entities/value-objects/company-with-details'

type PrismaCompanyWithDetailsProps = PrismaCompany & {
  user: PrismaUser & {
    avatar: PrismaAvatar | null
  }
}

export class PrismaCompanyWithDetailsMapper {
  static toDomain(raw: PrismaCompanyWithDetailsProps): CompanyWithDetails {
    return CompanyWithDetails.create({
      companyId: new UniqueEntityID(raw.id),
      avatarUrl: raw.user.avatar ? raw.user.avatar.url : null,
      userName: raw.user.name,
      city: raw.city,
      state: raw.state,
      site_url: raw.site_url,
      about: raw.user.about,
    })
  }
}
