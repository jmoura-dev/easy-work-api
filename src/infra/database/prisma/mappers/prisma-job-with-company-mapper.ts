import { Job as PrismaJob, User as PrismaUser } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { JobWithCompany } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-company'

type PrismaJobWithCompany = PrismaJob & {
  company: {
    user: PrismaUser
  }
}

export class PrismaJobWithCompanyMapper {
  static toDomain(raw: PrismaJobWithCompany): JobWithCompany {
    return JobWithCompany.create({
      jobId: new UniqueEntityID(raw.id),
      companyName: raw.company.user.name,
      title: raw.title,
      description: raw.description,
      workMode: raw.workMode,
      workSchedule: raw.workSchedule,
      remuneration: raw.remuneration,
      hoursPerWeek: raw.hoursPerWeek,
      created_at: raw.createdAt,
    })
  }
}
