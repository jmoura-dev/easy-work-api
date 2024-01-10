import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { DeveloperFactory } from 'test/factories/make-developer'
import { JwtService } from '@nestjs/jwt'
import { CandidatureFactory } from 'test/factories/make-candidature'
import { JobFactory } from 'test/factories/make-job'
import { CompanyFactory } from 'test/factories/make-company'
import { waitFor } from 'test/utils/wait-for'

describe('Notification On Database (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let companyFactory: CompanyFactory
  let candidatureFactory: CandidatureFactory
  let jobFactory: JobFactory
  let jwt: JwtService

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
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    candidatureFactory = moduleRef.get(CandidatureFactory)
    jobFactory = moduleRef.get(JobFactory)

    await app.init()
  })

  it('should send a notification when changed status', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
    })

    const userDeveloper = await userFactory.makePrismaUser()
    const developer = await developerFactory.makePrismaDeveloper({
      userId: userDeveloper.id,
    })

    const job = await jobFactory.makePrismaJob({
      companyId: company.id,
      title: 'Vaga desenvolvedor fullstack',
    })

    const candidature = await candidatureFactory.makePrismaCandidature({
      developerId: developer.id,
      jobId: job.id,
      status: 'Aguardando atualização',
    })
    const candidatureId = candidature.id.toString()

    await request(app.getHttpServer())
      .patch(`/candidatures/${candidatureId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: '[Aprovado] Aguarde contato para confirmar o contrato',
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: developer.id.toString(),
        },
      })
      console.log(notificationOnDatabase)

      expect(notificationOnDatabase).toBeTruthy()
    })
  })
})
