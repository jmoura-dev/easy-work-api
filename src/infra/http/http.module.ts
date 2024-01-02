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
import { CreateCandidatureController } from './controllers/create-candidature.controller'
import { CreateCandidatureUseCase } from '@/domain/easy-work/application/use-cases/create-candidature'
import { CreateJobController } from './controllers/create-job.controller'
import { CreateJobUseCase } from '@/domain/easy-work/application/use-cases/create-job'
import { CreateTechnologyController } from './controllers/create-technology.controller'
import { CreateTechnologyUseCase } from '@/domain/easy-work/application/use-cases/create-technology'
import { EditCompanyController } from './controllers/edit-company.controller'
import { EditCompanyDataUseCase } from '@/domain/easy-work/application/use-cases/edit-company-data'
import { EditDeveloperController } from './controllers/edit-developer.controller'
import { EditDeveloperDataUseCase } from '@/domain/easy-work/application/use-cases/edit-developer-data'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    AuthenticateUserController,
    CreateDeveloperController,
    CreateCompanyController,
    AddTechnologyToDeveloperController,
    CreateCandidatureController,
    CreateJobController,
    CreateTechnologyController,
    EditCompanyController,
    EditDeveloperController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateDeveloperUseCase,
    CreateCompanyUseCase,
    AddTechnologyToDeveloperUseCase,
    CreateCandidatureUseCase,
    CreateJobUseCase,
    CreateTechnologyUseCase,
    EditCompanyDataUseCase,
    EditDeveloperDataUseCase,
  ],
})
export class HttpModule {}
