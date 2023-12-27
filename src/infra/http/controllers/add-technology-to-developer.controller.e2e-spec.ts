import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { DeveloperFactory } from 'test/factories/make-developer'
import { JwtService } from '@nestjs/jwt'
import { TechnologyFactory } from 'test/factories/make-technology'

describe('Create Company Controller(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let technologyFactory: TechnologyFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeveloperFactory, TechnologyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    technologyFactory = moduleRef.get(TechnologyFactory)

    await app.init()
  })

  test('[POST] /developer-technology', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const technology = await technologyFactory.makePrismaTechnology({
      name: 'Typescript',
    })
    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post('/developer-technology')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        technologyId: technology.id.toString(),
      })

    expect(response.statusCode).toEqual(201)

    const developerTechnologyOnDatabase =
      await prisma.developerTechnology.findFirst({
        where: {
          developerId: developer.id.toString(),
        },
      })

    expect(developerTechnologyOnDatabase).toBeTruthy()
    expect(developerTechnologyOnDatabase?.developerId).toEqual(
      developer.id.toString(),
    )
  })
})
