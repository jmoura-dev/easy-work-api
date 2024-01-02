import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { CompanyFactory } from 'test/factories/make-company'
import { JwtService } from '@nestjs/jwt'

describe('Edit Company Controller(E2E)', () => {
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

  test('[PUT] /companies', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
      cnpj: '12345678900012',
      site_url: 'www.company.com',
    })

    const response = await request(app.getHttpServer())
      .put('/companies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: user.id.toString(),
        site_url: 'www.newCompany.com',
      })

    expect(response.statusCode).toEqual(200)

    const companyOnDatabase = await prisma.company.findUnique({
      where: {
        id: company.id.toString(),
      },
    })

    console.log(companyOnDatabase)

    expect(companyOnDatabase).toBeTruthy()
    expect(companyOnDatabase).toMatchObject({
      cnpj: '12345678900012',
      site_url: 'www.newCompany.com',
    })
  })
})
