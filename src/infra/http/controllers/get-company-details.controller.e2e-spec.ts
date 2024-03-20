import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { CompanyFactory } from 'test/factories/make-company'

describe('Get Company By ID(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let userFactory: UserFactory
  let companyFactory: CompanyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CompanyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    companyFactory = moduleRef.get(CompanyFactory)

    await app.init()
  })

  test('[GET] /companies/:user_id/details', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Contrata-LTDA',
      about: 'Empresa de tecnologia',
    })
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const company = await companyFactory.makePrismaCompany({
      userId: user.id,
      state: 'Alagoas',
      city: 'Maceió',
    })

    const response = await request(app.getHttpServer())
      .get(`/companies/${userId}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      companyWithDetails: expect.objectContaining({
        companyId: company.id.toString(),
        userName: 'contrata-ltda',
        state: 'Alagoas',
        city: 'Maceió',
        about: 'Empresa de tecnologia',
      }),
    })
  })
})
