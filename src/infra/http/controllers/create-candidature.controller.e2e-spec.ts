import { AppModule } from '@/infra/app.module'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeveloperFactory } from 'test/factories/make-developer'
import { JobFactory } from 'test/factories/make-job'
import { UserFactory } from 'test/factories/make-user'
import { CompanyFactory } from 'test/factories/make-company'

describe('Create Candidature [E2E]', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let jobFactory: JobFactory
  let companyFactory: CompanyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeveloperFactory, JobFactory, CompanyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    jobFactory = moduleRef.get(JobFactory)
    companyFactory = moduleRef.get(CompanyFactory)

    await app.init()
  })

  test('[POST] /candidatures', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const userCompany = await userFactory.makePrismaUser()
    const company = await companyFactory.makePrismaCompany({
      userId: userCompany.id,
    })

    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
    })
    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
    })

    const response = await request(app.getHttpServer())
      .post('/candidatures')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        jobId: job.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const candidatureOnDatabase = await prisma.candidature.findFirst({
      where: {
        developerId: developer.id.toString(),
      },
    })

    expect(candidatureOnDatabase?.status).toEqual('Aguardando atualizações.')
  })
})
