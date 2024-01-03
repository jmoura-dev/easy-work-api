import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { JobFactory } from 'test/factories/make-job'
import { CompanyFactory } from 'test/factories/make-company'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch List Jobs Controller(E2E)', () => {
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

  test('[GET] /jobs/:userId', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
    })

    await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Job-01',
      description: 'Job Description',
    })

    await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Job-02',
      description: 'Job Description',
    })

    const response = await request(app.getHttpServer())
      .get(`/jobs/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId,
      })

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      jobs: [
        expect.objectContaining({
          title: 'Job-02',
          description: 'Job Description',
        }),
        expect.objectContaining({
          title: 'Job-01',
          description: 'Job Description',
        }),
      ],
    })
  })
})
