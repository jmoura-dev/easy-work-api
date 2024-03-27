import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { CompanyFactory } from 'test/factories/make-company'
import { DeveloperFactory } from 'test/factories/make-developer'
import { CandidatureFactory } from 'test/factories/make-candidature'
import { JobFactory } from 'test/factories/make-job'

describe('Get Candidature By ID(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory
  let companyFactory: CompanyFactory
  let developerFactory: DeveloperFactory
  let candidatureFactory: CandidatureFactory
  let jobFactory: JobFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        DeveloperFactory,
        CandidatureFactory,
        JobFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    candidatureFactory = moduleRef.get(CandidatureFactory)
    jobFactory = moduleRef.get(JobFactory)

    await app.init()
  })

  test('[GET] /candidatures/:candidature_id/details', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
      state: 'Alagoas',
      city: 'Maceió',
    })

    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
    })

    const user01 = await userFactory.makePrismaUser()
    const developer = await developerFactory.makePrismaDeveloper({
      userId: user01.id,
    })

    const candidature = await candidatureFactory.makePrismaCandidature({
      developerId: developer.id,
      jobId: job.id,
      status: 'Pending',
    })

    const candidatureId = candidature.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/candidatures/${candidatureId}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      candidature: expect.objectContaining({
        id: candidature.id.toString(),
        status: 'Pending',
      }),
    })
  })
})
