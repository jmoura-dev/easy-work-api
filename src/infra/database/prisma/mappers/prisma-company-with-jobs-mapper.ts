import {
  User as PrismaUser,
  Company as PrismaCompany,
  Job as PrismaJob,
  Candidature as PrismaCandidature,
} from '@prisma/client'
import { CompanyWithJobs } from '@/domain/easy-work/enterprise/entities/value-objects/company-with-jobs'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaCompanyWithJobsProps = PrismaCompany & {
  user: PrismaUser
  job: PrismaJob & {
    candidatures: PrismaCandidature[]
  }
}

export class PrismaCompanyWithJobsMapper {
  static toDomain(raw: PrismaCompanyWithJobsProps): CompanyWithJobs {
    return CompanyWithJobs.create({
      companyId: new UniqueEntityID(raw.id),
      userName: raw.user.name,
      city: raw.city,
      state: raw.state,
      site_url: raw.site_url,
      title: raw.job.title,
      description: raw.job.description,
      createdAt: raw.job.createdAt,
    })
  }
}
