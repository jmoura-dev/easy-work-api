import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Job } from '@/domain/easy-work/enterprise/entities/job'
import { Prisma, Job as PrismaJob } from '@prisma/client'

export class PrismaJobMapper {
  static toDomain(raw: PrismaJob): Job {
    return Job.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        title: raw.title,
        description: raw.description,
        workMode: raw.workMode,
        workSchedule: raw.workSchedule,
        remuneration: raw.remuneration,
        hoursPerWeek: raw.hoursPerWeek,
        created_at: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(job: Job): Prisma.JobUncheckedCreateInput {
    return {
      id: job.id.toString(),
      companyId: job.companyId.toString(),
      title: job.title,
      description: job.description,
      workMode: job.workMode,
      workSchedule: job.workSchedule,
      remuneration: job.remuneration,
      hoursPerWeek: job.hoursPerWeek,
      createdAt: job.created_at,
    }
  }
}
