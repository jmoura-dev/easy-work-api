import { faker } from '@faker-js/faker'
import { Job, JobProps } from '@/domain/easy-work/enterprise/entities/job'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeJob(override: Partial<JobProps> = {}, id?: UniqueEntityID) {
  const job = Job.create(
    {
      title: faker.lorem.sentence(1),
      description: faker.lorem.text(),
      companyId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return job
}
