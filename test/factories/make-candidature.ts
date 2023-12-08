import { faker } from '@faker-js/faker'
import {
  Candidature,
  CandidatureProps,
} from '@/domain/easy-work/enterprise/entities/candidature'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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
