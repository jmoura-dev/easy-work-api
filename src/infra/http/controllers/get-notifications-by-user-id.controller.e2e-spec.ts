import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { CompanyFactory } from 'test/factories/make-company'
import { JobFactory } from 'test/factories/make-job'
import { JwtService } from '@nestjs/jwt'
import { DeveloperFactory } from 'test/factories/make-developer'
import { CandidatureFactory } from 'test/factories/make-candidature'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Get All Notifications by recipientId(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let userFactory: UserFactory
  let companyFactory: CompanyFactory
  let developerFactory: DeveloperFactory
  let jobFactory: JobFactory
  let candidatureFactory: CandidatureFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CompanyFactory,
        DeveloperFactory,
        JobFactory,
        CandidatureFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    jobFactory = moduleRef.get(JobFactory)
    candidatureFactory = moduleRef.get(CandidatureFactory)

    await app.init()
  })

  test('[GET] /notifications/:user_id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Javascript Company',
    })
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
    })

    const user01 = await userFactory.makePrismaUser()
    const developer = await developerFactory.makePrismaDeveloper({
      userId: user01.id,
    })

    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Desenvolvedor fullstack',
    })

    const candidature = await candidatureFactory.makePrismaCandidature({
      jobId: job.id,
      developerId: developer.id,
    })

    const candidatureId = candidature.id.toString()

    await request(app.getHttpServer())
      .patch(`/candidatures/${candidatureId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'Aprovado na primeira fase',
      })

    setTimeout(async () => {
      const notificationsOnDatabase = await prisma.notification.findMany()

      expect(notificationsOnDatabase.length).toEqual(1)
      expect(notificationsOnDatabase[0]).toMatchObject({
        status: 'Aprovado na primeira fase',
        developerId: developer.id.toString(),
      })
    }, 3000)
  })
})
