import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeveloperFactory } from 'test/factories/make-developer'
import { TechnologyFactory } from 'test/factories/make-technology'
import { DeveloperTechnologyFactory } from 'test/factories/make-developer-technology'

describe('Get Developers By Filters(E2E)', () => {
  let app: INestApplication

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

    userFactory = moduleRef.get(UserFactory)
    developerFactory = moduleRef.get(DeveloperFactory)
    technologyFactory = moduleRef.get(TechnologyFactory)
    developerTechnologyFactory = moduleRef.get(DeveloperTechnologyFactory)

    await app.init()
  })

  test('[GET] /developers/list', async () => {
    const user01 = await userFactory.makePrismaUser({
      name: 'Jackson Moura',
    })
    const user02 = await userFactory.makePrismaUser({
      name: 'Pedro',
    })
    const user03 = await userFactory.makePrismaUser({
      name: 'João',
    })

    const developer01 = await developerFactory.makePrismaDeveloper({
      userId: user01.id,
      occupation_area: 'FullStack',
    })
    const developer02 = await developerFactory.makePrismaDeveloper({
      userId: user02.id,
      occupation_area: 'FullStack',
    })
    const developer03 = await developerFactory.makePrismaDeveloper({
      userId: user03.id,
      occupation_area: 'Frontend',
    })

    const technology01 = await technologyFactory.makePrismaTechnology({
      name: 'Docker',
    })
    const technology02 = await technologyFactory.makePrismaTechnology({
      name: 'Typescript',
    })

    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer01.id,
      technologyId: technology01.id,
    })
    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer01.id,
      technologyId: technology02.id,
    })

    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer02.id,
      technologyId: technology01.id,
    })
    await developerTechnologyFactory.makePrismaDeveloper({
      developerId: developer03.id,
      technologyId: technology02.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/developers/list`)
      .send({
        occupation_area: 'FullStack',
        techs: ['Docker', 'Typescript'],
      })

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      developersWithTechs: [
        expect.objectContaining({
          developerId: developer01.id.toString(),
          userName: 'jackson moura',
          occupation_area: 'FullStack',
          techs: [
            expect.objectContaining({
              name: 'Docker',
            }),
            expect.objectContaining({
              name: 'Typescript',
            }),
          ],
        }),
      ],
    })
  })
})
