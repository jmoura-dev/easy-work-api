import { PaginationParams } from '@/core/repositories/pagination-params'
import { JobsRepository } from '@/domain/easy-work/application/repositories/jobs-repository'
import { Job } from '@/domain/easy-work/enterprise/entities/job'
import { PrismaJobMapper } from '../mappers/prisma-job-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { JobWithCompany } from '@/domain/easy-work/enterprise/entities/value-objects/job-with-company'
import { PrismaJobWithCompanyMapper } from '../mappers/prisma-job-with-company-mapper'

@Injectable()
export class PrismaJobsRepository implements JobsRepository {
  constructor(private prisma: PrismaService) {}

  async create(job: Job): Promise<void> {
    const data = PrismaJobMapper.toPrisma(job)

    await this.prisma.job.create({
      data,
    })
  }

  async findById(id: string): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({
      where: {
        id,
      },
    })

    if (!job) {
      return null
    }

    return PrismaJobMapper.toDomain(job)
  }

  async findBySlug(slug: string): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({
      where: {
        slug,
      },
    })

    if (!job) {
      return null
    }

    return PrismaJobMapper.toDomain(job)
  }

  async findMany({ page }: PaginationParams): Promise<JobWithCompany[]> {
    const jobs = await this.prisma.job.findMany({
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        company: {
          include: {
            user: true,
          },
        },
      },
    })

    return jobs.map((job) => PrismaJobWithCompanyMapper.toDomain(job))
  }

  async findManyByCompanyId(
    { page }: PaginationParams,
    companyId: string,
  ): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: {
        companyId,
      },
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return jobs.map((job) => PrismaJobMapper.toDomain(job))
  }
}
