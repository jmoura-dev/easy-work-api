import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'

describe('Create Technology Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /technologies', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/technologies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Typescript',
      })

    expect(response.statusCode).toEqual(201)

    const technologyOnDatabase = await prisma.technology.findUnique({
      where: {
        name: 'Typescript',
      },
    })

    expect(technologyOnDatabase).toBeTruthy()
    expect(technologyOnDatabase?.name).toEqual('Typescript')
  })
})
