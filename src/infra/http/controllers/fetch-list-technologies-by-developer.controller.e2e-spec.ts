import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { DeveloperFactory } from 'test/factories/make-developer'
import { TechnologyFactory } from 'test/factories/make-technology'
import { DeveloperTechnologyFactory } from 'test/factories/make-developer-technology'

describe('Fetch List Technologies Controller(E2E)', () => {
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

  test('[GET] /technologies/:userId', async () => {
    const user = await userFactory.makePrismaUser()
    const userId = user.id.toString()
    const accessToken = jwt.sign({ sub: userId })

    const developer = await developerFactory.makePrismaDeveloper({
      userId: user.id,
    })

    const docker = await technologyFactory.makePrismaTechnology({
      name: 'Docker',
    })

    const typescript = await technologyFactory.makePrismaTechnology({
      name: 'Typescript',
    })

    await developerTechnologyFactory.makePrismaDeveloper({
      technologyId: docker.id,
      developerId: developer.id,
    })

    await developerTechnologyFactory.makePrismaDeveloper({
      technologyId: typescript.id,
      developerId: developer.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/technologies/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId,
      })

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      technologies: [
        expect.objectContaining({
          name: 'Docker',
        }),
        expect.objectContaining({
          name: 'Typescript',
        }),
      ],
    })
  })
})
