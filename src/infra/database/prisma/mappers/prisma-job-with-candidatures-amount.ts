import {
  Job as PrismaJob,
  Developer as PrismaDeveloper,
  User as PrismaUser,
} from '@prisma/client'
import { JobWithCandidaturesAmount } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-candidatures-amount'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaJobWithCandidaturesAmountProps = PrismaJob & {
  candidature: ({
    developer: PrismaDeveloper & {
      user: PrismaUser
    }
  } & {
    id: string
    developerId: string
    jobId: string
    status: string
    createdAt: Date
    updatedAt: Date | null
  })[]
}

export class PrismaJobWithCandidaturesAmountMapper {
  static toDomain(
    raw: PrismaJobWithCandidaturesAmountProps,
  ): JobWithCandidaturesAmount {
    return JobWithCandidaturesAmount.create({
      jobId: new UniqueEntityID(raw.id),
      title: raw.title,
      description: raw.description,
      workMode: raw.workMode,
      workSchedule: raw.workSchedule,
      remuneration: raw.remuneration,
      hoursPerWeek: raw.hoursPerWeek,
      createdAt: raw.createdAt,
      amountCandidatures: raw.candidature.length,
      candidatures: raw.candidature.map((item) => {
        return {
          candidatureId: new UniqueEntityID(item.id),
          status: item.status,
          userId: item.developer.userId,
          userName: item.developer.user.name,
          occupation_area: item.developer.occupation_area,
        }
      }),
    })
  }
}
