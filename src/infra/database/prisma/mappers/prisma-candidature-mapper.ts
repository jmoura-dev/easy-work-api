import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Candidature } from '@/domain/easy-work/enterprise/entities/candidature'
import { Prisma, Candidature as PrismaCandidature } from '@prisma/client'

export class PrismaCandidatureMapper {
  static toDomain(raw: PrismaCandidature): Candidature {
    return Candidature.create(
      {
        developerId: new UniqueEntityID(raw.developerId),
        jobId: new UniqueEntityID(raw.jobId),
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    candidature: Candidature,
  ): Prisma.CandidatureUncheckedCreateInput {
    return {
      id: candidature.id.toString(),
      developerId: candidature.developerId.toString(),
      jobId: candidature.jobId.toString(),
      status: candidature.status,
      createdAt: candidature.createdAt,
      updatedAt: candidature.updatedAt,
    }
  }
}
