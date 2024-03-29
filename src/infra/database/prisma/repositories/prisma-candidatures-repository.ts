import { PaginationParams } from '@/core/repositories/pagination-params'
import { CandidaturesRepository } from '@/domain/easy-work/application/repositories/candidatures-repository'
import { Candidature } from '@/domain/easy-work/enterprise/entities/candidature'
import { PrismaCandidatureMapper } from '../mappers/prisma-candidature-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { CandidatureWithJobAndCompany } from '@/domain/easy-work/enterprise/entities/value-objects/candidature-with-job-and-company'
import { PrismaCandidatureWithJobAndCompanyMapper } from '../mappers/prisma-candidature-with-job-and-company-mapper'

@Injectable()
export class PrismaCandidaturesRepository implements CandidaturesRepository {
  constructor(private prisma: PrismaService) {}

  async create(candidature: Candidature): Promise<void> {
    const data = PrismaCandidatureMapper.toPrisma(candidature)

    await this.prisma.candidature.create({
      data,
    })
  }

  async findById(id: string): Promise<Candidature | null> {
    const candidature = await this.prisma.candidature.findUnique({
      where: {
        id,
      },
    })

    if (!candidature) {
      return null
    }

    return PrismaCandidatureMapper.toDomain(candidature)
  }

  async findManyByJobId(
    { page }: PaginationParams,
    jobId: string,
  ): Promise<Candidature[]> {
    const candidatures = await this.prisma.candidature.findMany({
      where: {
        jobId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return candidatures.map((candidature) =>
      PrismaCandidatureMapper.toDomain(candidature),
    )
  }

  async findManyByDeveloperId(
    { page }: PaginationParams,
    developerId: string,
  ): Promise<CandidatureWithJobAndCompany[]> {
    const candidatures = await this.prisma.candidature.findMany({
      where: {
        developerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        job: {
          include: {
            company: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return candidatures.map((candidature) =>
      PrismaCandidatureWithJobAndCompanyMapper.toDomain(candidature),
    )
  }

  async findMany(developerId: string): Promise<Candidature[]> {
    const candidatures = await this.prisma.candidature.findMany({
      where: {
        developerId,
      },
    })

    const candidaturesToDomain = candidatures.map((candidature) =>
      PrismaCandidatureMapper.toDomain(candidature),
    )

    return candidaturesToDomain
  }

  async save(candidature: Candidature): Promise<void> {
    const data = PrismaCandidatureMapper.toPrisma(candidature)

    await this.prisma.candidature.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(candidature.id)
  }
}
