import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { DeveloperFactory } from 'test/factories/make-developer'
import { JwtService } from '@nestjs/jwt'
import { Decimal } from '@prisma/client/runtime/library'

describe('Edit Developer Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeveloperFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)

    await app.init()
  })

  test('[PUT] /developers', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
      price_per_hour: 20,
      available_for_contract: false,
      occupation_area: 'FullStack',
    })

    const response = await request(app.getHttpServer())
      .put('/developers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: user.id.toString(),
        price_per_hour: 15,
        available_for_contract: true,
        occupation_area: 'FullStack',
      })

    expect(response.statusCode).toEqual(200)

    const developerOnDatabase = await prisma.developer.findUnique({
      where: {
        id: developer.id.toString(),
      },
    })

    expect(developerOnDatabase).toBeTruthy()
    expect(developerOnDatabase).toMatchObject({
      price_per_hour: new Decimal(15),
      available_for_contract: true,
      occupation_area: 'FullStack',
    })
  })
})
