import {
  Candidature as PrismaCandidature,
  User as PrismaUser,
  Job as PrismaJob,
} from '@prisma/client'
import { CandidatureWithJobAndCompany } from '@/domain/easy-work/enterprise/entities/value-objects/candidature-with-job-and-company'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaCandidatureWithJobAndCompany = PrismaCandidature & {
  job: PrismaJob & {
    company: {
      user: PrismaUser
    }
  }
}

export class PrismaCandidatureWithJobAndCompanyMapper {
  static toDomain(
    raw: PrismaCandidatureWithJobAndCompany,
  ): CandidatureWithJobAndCompany {
    return CandidatureWithJobAndCompany.create({
      candidatureId: new UniqueEntityID(raw.id),
      jobTitle: raw.job.title,
      companyName: raw.job.company.user.name,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
