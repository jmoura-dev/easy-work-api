import {
  Job as PrismaJob,
  Candidature as PrismaCandidature,
} from '@prisma/client'
import { JobWithCandidaturesAmount } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-candidatures-amount'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaJobWithCandidaturesAmountProps = PrismaJob & {
  candidature: PrismaCandidature[]
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
    })
  }
}
