import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from 'test/factories/make-user'
import { DeveloperFactory } from 'test/factories/make-developer'
import { TechnologyFactory } from 'test/factories/make-technology'

describe('Add technology to developer Controller(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let technologyFactory: TechnologyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeveloperFactory, TechnologyFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    technologyFactory = moduleRef.get(TechnologyFactory)

    await app.init()
  })

  test('[POST] /developer-technology/:user_id', async () => {
    const user = await userFactory.makePrismaUser()

    await technologyFactory.makePrismaTechnology({
      name: 'Typescript',
    })
    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
    })

    const userId = user.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/developer-technology/${userId}`)
      .send({
        technologyName: 'Typescript',
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
