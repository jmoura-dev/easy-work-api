import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { DeveloperFactory } from 'test/factories/make-developer'
import { JwtService } from '@nestjs/jwt'
import { CompanyFactory } from 'test/factories/make-company'
import { CandidatureFactory } from 'test/factories/make-candidature'
import { JobFactory } from 'test/factories/make-job'

describe('Fetch Candidatures By Developer Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let companyFactory: CompanyFactory
  let jobFactory: JobFactory
  let candidatureFactory: CandidatureFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        DeveloperFactory,
        CompanyFactory,
        JobFactory,
        CandidatureFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    jobFactory = moduleRef.get(JobFactory)
    candidatureFactory = moduleRef.get(CandidatureFactory)

    await app.init()
  })

  test('[GET] /candidatures/:user_id/developer', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
      price_per_hour: 20,
      available_for_contract: false,
      occupation_area: 'FullStack',
    })

    const userCompany = await userFactory.makePrismaUser()
    const company = await companyFactory.makePrismaCompany({
      userId: userCompany.id,
    })

    const job01 = await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor Backend',
    })
    const job02 = await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor Frontend',
    })

    await candidatureFactory.makePrismaCandidature({
      developerId: developer.id,
      jobId: job01.id,
      status: 'Aprovado no teste técnico',
    })
    await candidatureFactory.makePrismaCandidature({
      developerId: developer.id,
      jobId: job02.id,
      status: 'Reprovado no teste técnico',
    })

    const response = await request(app.getHttpServer())
      .get(`/candidatures/${userId}/developer`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      candidatures: [
        expect.objectContaining({
          status: 'Reprovado no teste técnico',
        }),
        expect.objectContaining({
          status: 'Aprovado no teste técnico',
        }),
      ],
    })
  })
})
