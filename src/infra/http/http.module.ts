import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateUserController } from './controllers/create-user.controller'
import { CreateUserUseCase } from '@/domain/easy-work/application/use-cases/create-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateUserController } from './controllers/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/easy-work/application/use-cases/authenticate-user'
import { CreateDeveloperController } from './controllers/create-developer.controller'
import { CreateDeveloperUseCase } from '@/domain/easy-work/application/use-cases/create-developer'
import { CreateCompanyController } from './controllers/create-company.controller'
import { CreateCompanyUseCase } from '@/domain/easy-work/application/use-cases/create-company'
import { AddTechnologyToDeveloperController } from './controllers/add-technology-to-developer.controller'
import { AddTechnologyToDeveloperUseCase } from '@/domain/easy-work/application/use-cases/add-technology-to-developer'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    AuthenticateUserController,
    CreateDeveloperController,
    CreateCompanyController,
    AddTechnologyToDeveloperController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateDeveloperUseCase,
    CreateCompanyUseCase,
    AddTechnologyToDeveloperUseCase,
  ],
})
export class HttpModule {}
