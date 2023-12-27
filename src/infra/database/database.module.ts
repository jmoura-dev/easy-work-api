import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/easy-work/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'
import { PrismaDevelopersRepository } from './prisma/repositories/prisma-developers-repository'
import { CompaniesRepository } from '@/domain/easy-work/application/repositories/companies-repository'
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository'
import { DeveloperTechnologiesRepository } from '@/domain/easy-work/application/repositories/developer-technologies-repository'
import { PrismaDeveloperTechnologiesRepository } from './prisma/repositories/prisma-developer-technologies-repository'
import { TechnologiesRepository } from '@/domain/easy-work/application/repositories/technologies-repository'
import { PrismaTechnologiesRepository } from './prisma/repositories/prisma-technologies-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: DevelopersRepository,
      useClass: PrismaDevelopersRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: TechnologiesRepository,
      useClass: PrismaTechnologiesRepository,
    },
    {
      provide: DeveloperTechnologiesRepository,
      useClass: PrismaDeveloperTechnologiesRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    DevelopersRepository,
    CompaniesRepository,
    TechnologiesRepository,
    DeveloperTechnologiesRepository,
  ],
})
export class DatabaseModule {}
