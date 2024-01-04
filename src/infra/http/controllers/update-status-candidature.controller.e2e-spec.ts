import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeveloperFactory } from 'test/factories/make-developer'
import { CandidatureFactory } from 'test/factories/make-candidature'
import { CompanyFactory } from 'test/factories/make-company'
import { JobFactory } from 'test/factories/make-job'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Update Status Candidature Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let companyFactory: CompanyFactory
  let candidatureFactory: CandidatureFactory
  let jobFactory: JobFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        DeveloperFactory,
        CompanyFactory,
        CandidatureFactory,
        JobFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    candidatureFactory = moduleRef.get(CandidatureFactory)
    jobFactory = moduleRef.get(JobFactory)

    await app.init()
  })

  test('[PUT] /candidatures/:candidature_id', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
    })
    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
    })

    const userCompany = await userFactory.makePrismaUser()
    const developer = await developerFactory.makePrismaDeveloper({
      userId: userCompany.id,
    })

    const candidature = await candidatureFactory.makePrismaCandidature({
      developerId: developer.id,
      jobId: job.id,
      status: 'Candidatura feita com sucesso!',
    })
    const candidatureId = candidature.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/candidatures/${candidatureId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId,
        candidatureId,
        status: 'Avaliando teste técnico',
      })

    expect(response.statusCode).toEqual(200)

    const candidatureOnDatabase = await prisma.candidature.findUnique({
      where: {
        id: candidatureId,
      },
    })

    console.log(candidatureOnDatabase)

    expect(candidatureOnDatabase).toBeTruthy()
    expect(candidatureOnDatabase?.status).toEqual('Avaliando teste técnico')
  })
})
