import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { CompanyFactory } from 'test/factories/make-company'
import { JobFactory } from 'test/factories/make-job'
import { JwtService } from '@nestjs/jwt'

describe('Get All Jobs(E2E)', () => {
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

  test('[GET] /jobs/list', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Javascript Company',
    })
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const company = await companyFactory.makePrismaCompany({ userId: user.id })

    await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor fullstack',
    })

    await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor backend',
    })

    const response = await request(app.getHttpServer())
      .get('/jobs/fetch/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      jobs: [
        expect.objectContaining({
          title: 'desenvolvedor backend',
          companyName: 'Javascript Company',
        }),
        expect.objectContaining({
          title: 'desenvolvedor fullstack',
          companyName: 'Javascript Company',
        }),
      ],
    })
  })
})
