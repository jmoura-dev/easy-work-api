import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'

describe('Create Developer Controller(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /developers', async () => {
    const user = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer())
      .post('/developers')
      .send({
        userId: user.id.toString(),
        occupation_area: 'Backend',
      })

    expect(response.statusCode).toEqual(201)

    const developerOnDatabase = await prisma.developer.findUnique({
      where: {
        userId: user.id.toString(),
      },
    })

    expect(developerOnDatabase).toBeTruthy()
    expect(developerOnDatabase?.occupation_area).toEqual('Backend')
  })
})
