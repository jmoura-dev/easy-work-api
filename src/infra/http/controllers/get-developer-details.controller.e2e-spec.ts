import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeveloperFactory } from 'test/factories/make-developer'
import { TechnologyFactory } from 'test/factories/make-technology'
import { DeveloperTechnologyFactory } from 'test/factories/make-developer-technology'
import { JwtService } from '@nestjs/jwt'

describe('Get Developer By ID(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

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

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    technologyFactory = moduleRef.get(TechnologyFactory)
    developerTechnologyFactory = moduleRef.get(DeveloperTechnologyFactory)

    await app.init()
  })

  test('[GET] /developers/:user_id/details', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Jackson Moura',
      about: 'Desenvolvedor pragmático',
    })
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
      occupation_area: 'FullStack',
    })

    const technology01 = await technologyFactory.makePrismaTechnology({
      name: 'Docker',
    })
    const technology02 = await technologyFactory.makePrismaTechnology({
      name: 'Typescript',
    })

    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer.id,
      technologyId: technology01.id,
    })
    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer.id,
      technologyId: technology02.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/developers/${userId}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      developerWithDetails: expect.objectContaining({
        developerId: developer.id.toString(),
        userName: 'jackson moura',
        occupation_area: 'FullStack',
        about: 'Desenvolvedor pragmático',
        techs: [
          expect.objectContaining({
            name: 'Docker',
          }),
          expect.objectContaining({
            name: 'Typescript',
          }),
        ],
      }),
    })
  })
})
