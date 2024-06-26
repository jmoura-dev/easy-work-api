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
import { FetchListJobsByCompanyController } from './controllers/fetch-list-jobs-by-company.controller'
import { FetchListJobsByCompanyUseCase } from '@/domain/easy-work/application/use-cases/fetch-list-jobs-by-company'
import { FetchListTechnologiesByDeveloperController } from './controllers/fetch-list-technologies-by-developer.controller'
import { FetchListTechnologiesByDeveloperUseCase } from '@/domain/easy-work/application/use-cases/fetch-list-technologies-by-developer'
import { UpdateStatusCandidatureUseCase } from '@/domain/easy-work/application/use-cases/update-status-candidature'
import { UpdateStatusCandidatureController } from './controllers/update-status-candidature.controller'
import { FetchListCandidaturesByJobController } from './controllers/fetch-list-candidatures-by-job.controller'
import { FetchListCandidaturesByJobUseCase } from '@/domain/easy-work/application/use-cases/fetch-list-candidatures-by-job'
import { GetJobDetailsByIdController } from './controllers/get-job-details-by-id.controller'
import { GetJobDetailsByIdUseCase } from '@/domain/easy-work/application/use-cases/get-job-details-by-id'
import { FetchCandidaturesByDeveloperController } from './controllers/fetch-candidatures-by-developer.controller'
import { FetchCandidaturesByDeveloperUseCase } from '@/domain/easy-work/application/use-cases/fetch-candidatures-by-developer'
import { UploadAvatarController } from './controllers/upload-avatar.controller'
import { UploadAndCreateAvatarUseCase } from '@/domain/easy-work/application/use-cases/upload-and-create-avatar'
import { StorageModule } from '../storage/storage.module'
import { EditUserController } from './controllers/edit-user.controller'
import { EditUserDataUseCase } from '@/domain/easy-work/application/use-cases/edit-user-data'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { GetDevelopersByQueriesController } from './controllers/get-developers-by-filters.controller'
import { GetAllDevelopersUseCase } from '@/domain/easy-work/application/use-cases/get-all-developers'
import { GetListAllJobsController } from './controllers/get-list-all-jobs.controller'
import { GetAllJobsUseCase } from '@/domain/easy-work/application/use-cases/get-list-all-jobs'
import { GetDeveloperDetailsUseCase } from '@/domain/easy-work/application/use-cases/get-developer-details'
import { GetDeveloperDetailsController } from './controllers/get-developer-details.controller'
import { GetAllTechnologiesController } from './controllers/get-all-technologies.controller'
import { GetAllTechnologiesUseCase } from '@/domain/easy-work/application/use-cases/get-all-technologies'
import { GetCompanyDetailsController } from './controllers/get-company-details.controller'
import { GetCompanyDetailsUseCase } from '@/domain/easy-work/application/use-cases/get-company-details'
import { GetJobsWithCandidaturesAmountController } from './controllers/get-jobs-with-candidatures-amount.controller'
import { GetJobWithCandidaturesAmountUseCase } from '@/domain/easy-work/application/use-cases/get-job-with-candidatures-amount'
import { GetCandidatureByIdController } from './controllers/get-candidature-by-id.controller'
import { GetCandidatureByIdUseCase } from '@/domain/easy-work/application/use-cases/get-candidature-by-id'
import { GetNotificationsByUserIdController } from './controllers/get-notifications-by-user-id.controller'
import { GetNotificationsUseCase } from '@/domain/notification/application/use-cases/get-notifications-by-recipient-id'
import { UpdateDeveloperTechnologiesController } from './controllers/update-developer-technologies.controller'
import { UpdateDeveloperTechnologiesUseCase } from '@/domain/easy-work/application/use-cases/update-developer-technologies'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
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
    FetchListJobsByCompanyController,
    FetchListTechnologiesByDeveloperController,
    UpdateStatusCandidatureController,
    FetchListCandidaturesByJobController,
    GetJobDetailsByIdController,
    FetchCandidaturesByDeveloperController,
    UploadAvatarController,
    EditUserController,
    ReadNotificationController,
    GetDevelopersByQueriesController,
    GetListAllJobsController,
    GetDeveloperDetailsController,
    GetAllTechnologiesController,
    GetCompanyDetailsController,
    GetJobsWithCandidaturesAmountController,
    GetCandidatureByIdController,
    GetNotificationsByUserIdController,
    UpdateDeveloperTechnologiesController,
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
    FetchListJobsByCompanyUseCase,
    FetchListTechnologiesByDeveloperUseCase,
    UpdateStatusCandidatureUseCase,
    FetchListCandidaturesByJobUseCase,
    GetJobDetailsByIdUseCase,
    FetchCandidaturesByDeveloperUseCase,
    UploadAndCreateAvatarUseCase,
    EditUserDataUseCase,
    ReadNotificationUseCase,
    GetAllDevelopersUseCase,
    GetAllJobsUseCase,
    GetDeveloperDetailsUseCase,
    GetAllTechnologiesUseCase,
    GetCompanyDetailsUseCase,
    GetJobWithCandidaturesAmountUseCase,
    GetCandidatureByIdUseCase,
    GetNotificationsUseCase,
    UpdateDeveloperTechnologiesUseCase,
  ],
})
export class HttpModule {}
