import { faker } from '@faker-js/faker'
import {
  Candidature,
  CandidatureProps,
} from '@/domain/easy-work/enterprise/entities/candidature'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaCandidatureMapper } from '@/infra/database/prisma/mappers/prisma-candidature-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeCandidature(
  override: Partial<CandidatureProps> = {},
  id?: UniqueEntityID,
) {
  const candidature = Candidature.create(
    {
      developerId: new UniqueEntityID(),
      jobId: new UniqueEntityID(),
      status: faker.lorem.sentence(1),
      ...override,
    },
    id,
  )

  return candidature
}

@Injectable()
export class CandidatureFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCandidature(
    data: Partial<CandidatureProps> = {},
  ): Promise<Candidature> {
    const candidature = makeCandidature(data)

    await this.prisma.candidature.create({
      data: PrismaCandidatureMapper.toPrisma(candidature),
    })

    return candidature
  }
}
