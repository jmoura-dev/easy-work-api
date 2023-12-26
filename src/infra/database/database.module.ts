import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/easy-work/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { DevelopersRepository } from '@/domain/easy-work/application/repositories/developers-repository'
import { PrismaDevelopersRepository } from './prisma/repositories/prisma-developers-repository'

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
  ],
  exports: [PrismaService, UsersRepository, DevelopersRepository],
})
export class DatabaseModule {}
