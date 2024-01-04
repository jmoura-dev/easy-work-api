import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { JobFactory } from 'test/factories/make-job'
import { CompanyFactory } from 'test/factories/make-company'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get Job Details Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory
  let companyFactory: CompanyFactory
  let jobFactory: JobFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory, JobFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    jobFactory = moduleRef.get(JobFactory)

    await app.init()
  })

  test('[GET] /jobs/:job_id', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
    })

    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor backend',
      description: 'Vaga disponível para desenvolvedor backend',
    })

    const jobId = job.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/jobs/${jobId}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      job: expect.objectContaining({
        title: 'Desenvolvedor backend',
        description: 'Vaga disponível para desenvolvedor backend',
      }),
    })
  })
})
