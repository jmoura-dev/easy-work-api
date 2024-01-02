import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { CompanyFactory } from 'test/factories/make-company'

describe('Create Job Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let companyFactory: CompanyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    companyFactory = moduleRef.get(CompanyFactory)

    await app.init()
  })

  test('[POST] /jobs', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const company = await companyFactory.makePrismaCompany({ userId: user.id })

    const response = await request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: user.id.toString(),
        title: 'new job',
        description: 'new job description',
      })

    expect(response.statusCode).toEqual(201)

    const jobOnDatabase = await prisma.job.findUnique({
      where: {
        companyId: company.id.toString(),
      },
    })

    expect(jobOnDatabase).toBeTruthy()
    expect(jobOnDatabase).toMatchObject({
      title: 'new job',
      description: 'new job description',
    })
  })
})
