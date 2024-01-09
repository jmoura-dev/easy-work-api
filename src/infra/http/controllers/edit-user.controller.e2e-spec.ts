import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { DeveloperFactory } from 'test/factories/make-developer'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcryptjs'

describe('Edit User Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeveloperFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[PUT] /users/:user_id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: await hash('123456', 8),
      about: 'Developer freelancer',
    })
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jackson Moura',
        oldPassword: '123456',
        newPassword: '7654321',
        about: 'development student with Javascript language',
      })

    expect(response.statusCode).toEqual(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase).toMatchObject({
      name: 'Jackson Moura',
      email: 'john.doe@gmail.com',
      about: 'development student with Javascript language',
    })
  })
})
