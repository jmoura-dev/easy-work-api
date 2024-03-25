import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { JobFactory } from 'test/factories/make-job'
import { CompanyFactory } from 'test/factories/make-company'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeveloperFactory } from 'test/factories/make-developer'
import { CandidatureFactory } from 'test/factories/make-candidature'

describe('Get Jobs With Candidatures Amount Controller(E2E)', () => {
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

  test('[GET] /jobs/:user_id/candidatures/amount', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
    })

    const userDeveloper01 = await userFactory.makePrismaUser()
    const developer01 = await developerFactory.makePrismaDeveloper({
      userId: userDeveloper01.id,
    })

    const userDeveloper02 = await userFactory.makePrismaUser()
    const developer02 = await developerFactory.makePrismaDeveloper({
      userId: userDeveloper02.id,
    })

    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor backend',
      description: 'Vaga disponível para desenvolvedor backend',
    })

    await candidatureFactory.makePrismaCandidature({
      developerId: developer01.id,
      jobId: job.id,
    })

    await candidatureFactory.makePrismaCandidature({
      developerId: developer02.id,
      jobId: job.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/jobs/${userId}/candidatures/amount`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      jobsWithCandidaturesAmount: [
        expect.objectContaining({
          id: job.id.toString(),
          title: 'Desenvolvedor backend',
          description: 'Vaga disponível para desenvolvedor backend',
          candidaturesAmount: 2,
        }),
      ],
    })
  })
})
