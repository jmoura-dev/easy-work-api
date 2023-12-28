import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Job } from '@/domain/easy-work/enterprise/entities/job'
import { Slug } from '@/domain/easy-work/enterprise/entities/value-objects/slug'
import { Prisma, Job as PrismaJob } from '@prisma/client'

export class PrismaJobMapper {
  static toDomain(raw: PrismaJob): Job {
    return Job.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        title: raw.title,
        description: raw.description,
        slug: Slug.create(raw.slug),
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
      slug: String(job.slug),
      createdAt: job.created_at,
    }
  }
}
