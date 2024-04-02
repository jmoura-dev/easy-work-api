import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeveloperFactory } from 'test/factories/make-developer'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TechnologyFactory } from 'test/factories/make-technology'
import { DeveloperTechnologyFactory } from 'test/factories/make-developer-technology'

describe('Update Developer Technologies Controller(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let userFactory: UserFactory
  let developerFactory: DeveloperFactory
  let technologyFactory: TechnologyFactory
  let developerTechnologyFactory: DeveloperTechnologyFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        DeveloperFactory,
        TechnologyFactory,
        DeveloperTechnologyFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    technologyFactory = moduleRef.get(TechnologyFactory)
    developerTechnologyFactory = moduleRef.get(DeveloperTechnologyFactory)

    await app.init()
  })

  test('[PUT] /developer-technology/:user_id/update', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()

    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
    })
    const developerId = developer.id.toString()

    const technology01 = await technologyFactory.makePrismaTechnology({
      name: 'Docker',
    })
    const technology02 = await technologyFactory.makePrismaTechnology({
      name: 'Java',
    })
    const technology03 = await technologyFactory.makePrismaTechnology({
      name: 'Nestjs',
    })

    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer.id,
      technologyId: technology01.id,
    })
    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer.id,
      technologyId: technology02.id,
    })

    const accessToken = jwt.sign({ sub: userId })

    const response = await request(app.getHttpServer())
      .put(`/developer-technology/${userId}/update`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        techs: [{ name: 'Java' }, { name: 'Nestjs' }],
      })

    expect(response.statusCode).toEqual(201)

    const developerTechnologiesOnDatabase =
      await prisma.developerTechnology.findMany({
        where: {
          developerId,
        },
      })

    expect(developerTechnologiesOnDatabase.length).toEqual(2)
    expect(developerTechnologiesOnDatabase).toEqual([
      expect.objectContaining({
        developerId,
        technologyId: technology02.id.toString(),
      }),
      expect.objectContaining({
        developerId,
        technologyId: technology03.id.toString(),
      }),
    ])
  })
})
