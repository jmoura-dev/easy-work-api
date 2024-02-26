import { faker } from '@faker-js/faker'
import { Job, JobProps } from '@/domain/easy-work/enterprise/entities/job'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaJobMapper } from '@/infra/database/prisma/mappers/prisma-job-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeJob(override: Partial<JobProps> = {}, id?: UniqueEntityID) {
  const job = Job.create(
    {
      title: faker.lorem.sentence(1),
      description: faker.lorem.text(),
      workMode: faker.lorem.sentence(1),
      workSchedule: faker.lorem.sentence(1),
      hoursPerWeek: faker.number.int(2),
      remuneration: faker.number.int(4),
      companyId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return job
}

@Injectable()
export class JobFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaJob(data: Partial<JobProps> = {}): Promise<Job> {
    const job = makeJob(data)

    await this.prisma.job.create({
      data: PrismaJobMapper.toPrisma(job),
    })

    return job
  }
}
